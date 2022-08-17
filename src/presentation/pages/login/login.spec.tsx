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
  populateEmailField(sut, email);
  populatePasswordField(sut, password);

  const form = sut.getByTestId("form");
  fireEvent.submit(form);

  await waitFor(() => form);
};

const populateEmailField = (
  sut: RenderResult,
  email = faker.internet.email()
): void => {
  const emailInput = sut.getByTestId("email");
  fireEvent.input(emailInput, {
    target: { value: email },
  });
};

const populatePasswordField = (
  sut: RenderResult,
  password = faker.internet.password()
): void => {
  const passwordInput = sut.getByTestId("password");
  fireEvent.input(passwordInput, {
    target: { value: password },
  });
};

const testStatusForField = (
  sut: RenderResult,
  fieldName: string,
  validationError?: string
): void => {
  const fieldStatus = sut.getByTestId(`${fieldName}-status`);
  expect(fieldStatus.title).toBe(validationError || "Ok");
  expect(fieldStatus.textContent).toBe(validationError ? "🔴" : "🟢");
};

const testErrorWrapChildCount = (sut: RenderResult, count: number): void => {
  const errorWrap = sut.getByTestId("error-wrap");
  expect(errorWrap.childElementCount).toBe(count);
};

const testElementExistance = (sut: RenderResult, fieldName: string): void => {
  const el = sut.getByTestId(fieldName);
  expect(el).toBeTruthy();
};

const testIsButtonDisabled = (
  sut: RenderResult,
  fieldName: string,
  isDisabled: boolean
): void => {
  const button = sut.getByTestId(fieldName) as HTMLButtonElement;
  expect(button.disabled).toBe(isDisabled);
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

    testErrorWrapChildCount(sut, 0);

    testIsButtonDisabled(sut, "submit", true);

    testStatusForField(sut, "email", validationError);
    testStatusForField(sut, "password", validationError);
  });

  it("Should show email error if validation fails", () => {
    const validationError = faker.random.word();
    const { sut } = makeSut({ validationError });

    populateEmailField(sut);

    testStatusForField(sut, "email", validationError);
  });

  it("Should show password error if validation fails", () => {
    const validationError = faker.random.word();
    const { sut } = makeSut({ validationError });

    populatePasswordField(sut);

    testStatusForField(sut, "password", validationError);
  });

  it("Should show valid email state if validation succeeds", () => {
    const { sut } = makeSut();

    populateEmailField(sut);

    testStatusForField(sut, "email");
  });

  it("Should show valid password state if validation succeeds", () => {
    const { sut } = makeSut();

    populatePasswordField(sut);

    testStatusForField(sut, "password");
  });

  it("Should enable submit button if form is valid", () => {
    const { sut } = makeSut();

    populateEmailField(sut);
    populatePasswordField(sut);

    testIsButtonDisabled(sut, "submit", false);
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

    testErrorWrapChildCount(sut, 1);
  });

  it("Should call SaveAccessToken on success", async () => {
    const { sut, authenticationSpy, saveAccessTokenMock } = makeSut();

    await simulateValidSubmit(sut);

    expect(saveAccessTokenMock.accessToken).toBe(
      authenticationSpy.account.accessToken
    );
    expect(history.location.pathname).toBe("/");
  });

  it("Should go to signup page", () => {
    const { sut } = makeSut();

    const register = sut.getByTestId("signup");
    fireEvent.click(register);

    expect(history.location.pathname).toBe("/signup");
  });
});
