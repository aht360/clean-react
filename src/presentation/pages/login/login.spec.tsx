import React from "react";
import "jest-localstorage-mock";
import {
  cleanup,
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from "@testing-library/react";
import {
  AuthenticationSpy,
  ValidationStub,
  SaveAccessTokenMock,
  Helper,
} from "@/presentation/test";
import faker from "@faker-js/faker";
import { InvalidCredentialsError } from "@/domain/errors";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { Login } from "@/presentation/pages";

type SutTypes = {
  sut: RenderResult;
  authenticationSpy: AuthenticationSpy;
  saveAccessTokenMock: SaveAccessTokenMock;
};

type SutParams = {
  validationError: string;
};

const history = createMemoryHistory({
  initialEntries: ["/login"],
});
const location = {
  pathname: "/",
};

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  validationStub.errorMessage = params?.validationError;

  const authenticationSpy = new AuthenticationSpy();

  const saveAccessTokenMock = new SaveAccessTokenMock();

  const sut = render(
    <Router navigator={history} location={location}>
      <Login
        validation={validationStub}
        authentication={authenticationSpy}
        saveAccessToken={saveAccessTokenMock}
      />
    </Router>
  );

  return {
    sut,
    authenticationSpy,
    saveAccessTokenMock,
  };
};

const simulateValidSubmit = async (
  sut: RenderResult,
  email = faker.internet.email(),
  password = faker.internet.password()
): Promise<void> => {
  Helper.populateField(sut, "email", email);
  Helper.populateField(sut, "password", password);

  const form = sut.getByTestId("form");
  fireEvent.submit(form);

  await waitFor(() => form);
};

const testElementExistance = (sut: RenderResult, fieldName: string): void => {
  const el = sut.getByTestId(fieldName);
  expect(el).toBeTruthy();
};

const testElementText = (
  sut: RenderResult,
  fieldName: string,
  text: string
): void => {
  const el = sut.getByTestId(fieldName);
  expect(el.textContent).toBe(text);
};

describe("Login page", () => {
  afterEach(cleanup);

  it("Should start with initial state", () => {
    const validationError = faker.random.word();
    const { sut } = makeSut({ validationError });

    Helper.testChildCount(sut, "error-wrap", 0);

    Helper.testIsButtonDisabled(sut, "submit", true);

    Helper.testStatusForField(sut, "email", validationError);
    Helper.testStatusForField(sut, "password", validationError);
  });

  it("Should show email error if validation fails", () => {
    const validationError = faker.random.word();
    const { sut } = makeSut({ validationError });

    Helper.populateField(sut, "email");

    Helper.testStatusForField(sut, "email", validationError);
  });

  it("Should show password error if validation fails", () => {
    const validationError = faker.random.word();
    const { sut } = makeSut({ validationError });

    Helper.populateField(sut, "password");

    Helper.testStatusForField(sut, "password", validationError);
  });

  it("Should show valid email state if validation succeeds", () => {
    const { sut } = makeSut();

    Helper.populateField(sut, "email");

    Helper.testStatusForField(sut, "email");
  });

  it("Should show valid password state if validation succeeds", () => {
    const { sut } = makeSut();

    Helper.populateField(sut, "password");

    Helper.testStatusForField(sut, "password");
  });

  it("Should enable submit button if form is valid", () => {
    const { sut } = makeSut();

    Helper.populateField(sut, "email");
    Helper.populateField(sut, "password");

    Helper.testIsButtonDisabled(sut, "submit", false);
  });

  it("Should show spinner on submit", async () => {
    const { sut } = makeSut();

    await simulateValidSubmit(sut);

    testElementExistance(sut, "spinner");
  });

  it("Should call authentication with correct values", async () => {
    const { sut, authenticationSpy } = makeSut();

    const email = faker.internet.email();
    const password = faker.internet.password();

    await simulateValidSubmit(sut, email, password);

    expect(authenticationSpy.params).toEqual({
      email,
      password,
    });
  });

  it("Should call authentication only once", async () => {
    const { sut, authenticationSpy } = makeSut();

    await simulateValidSubmit(sut);
    await simulateValidSubmit(sut);

    expect(authenticationSpy.callsCount).toBe(1);
  });

  it("Should not call authentication if form is invalid", async () => {
    const validationError = faker.random.word();
    const { sut, authenticationSpy } = makeSut({ validationError });

    await simulateValidSubmit(sut);

    expect(authenticationSpy.callsCount).toBe(0);
  });

  it("Should present error if authentication fails", async () => {
    const { sut, authenticationSpy } = makeSut();

    const error = new InvalidCredentialsError();

    jest
      .spyOn(authenticationSpy, "auth")
      .mockReturnValueOnce(Promise.reject(error));

    await simulateValidSubmit(sut);

    const mainError = await waitFor(() => sut.getByTestId("main-error"));
    expect(mainError.textContent).toBe(error.message);

    Helper.testChildCount(sut, "error-wrap", 1);
  });

  it("Should call SaveAccessToken on success", async () => {
    const { sut, authenticationSpy, saveAccessTokenMock } = makeSut();

    await simulateValidSubmit(sut);

    expect(saveAccessTokenMock.accessToken).toBe(
      authenticationSpy.account.accessToken
    );
    expect(history.location.pathname).toBe("/");
  });

  it("Should present error if SaveAccessToken fails", async () => {
    const { sut, saveAccessTokenMock } = makeSut();

    const error = new InvalidCredentialsError();

    jest
      .spyOn(saveAccessTokenMock, "save")
      .mockReturnValueOnce(Promise.reject(error));

    await simulateValidSubmit(sut);

    const mainError = await waitFor(() => sut.getByTestId("main-error"));
    expect(mainError.textContent).toBe(error.message);

    Helper.testChildCount(sut, "error-wrap", 1);
  });

  it("Should go to signup page", () => {
    const { sut } = makeSut();

    const register = sut.getByTestId("signup");
    fireEvent.click(register);

    expect(history.location.pathname).toBe("/signup");
  });
});
