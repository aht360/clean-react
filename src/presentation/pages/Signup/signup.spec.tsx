import {
  cleanup,
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from "@testing-library/react";
import React from "react";
import SignUp from "./Signup";
import {
  AddAccountSpy,
  Helper,
  SaveAccessTokenMock,
  ValidationStub,
} from "@/presentation/test";
import faker from "@faker-js/faker";
import { EmailInUseError } from "@/domain/errors";
import { testElementText } from "@/presentation/test/form-helper";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

type SutTypes = {
  sut: RenderResult;
  addAccountSpy: AddAccountSpy;
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

  const addAccountSpy = new AddAccountSpy();

  const saveAccessTokenMock = new SaveAccessTokenMock();

  const sut = render(
    <Router navigator={history} location={location}>
      <SignUp
        validation={validationStub}
        addAccount={addAccountSpy}
        saveAccessToken={saveAccessTokenMock}
      />
    </Router>
  );

  return {
    sut,
    addAccountSpy,
    saveAccessTokenMock,
  };
};

const simulateValidSubmit = async (
  sut: RenderResult,
  name = faker.name.findName(),
  email = faker.internet.email(),
  password = faker.internet.password()
): Promise<void> => {
  Helper.populateField(sut, "name", name);
  Helper.populateField(sut, "email", email);
  Helper.populateField(sut, "password", password);
  Helper.populateField(sut, "passwordConfirmation", password);

  const form = sut.getByTestId("form");
  fireEvent.submit(form);

  await waitFor(() => form);
};

describe("Signup component", () => {
  afterEach(cleanup);

  test("Should start with initial state", () => {
    const validationError = faker.random.word();

    const { sut } = makeSut({ validationError });

    Helper.testChildCount(sut, "error-wrap", 0);

    Helper.testIsButtonDisabled(sut, "submit", true);

    Helper.testStatusForField(sut, "name", validationError);
    Helper.testStatusForField(sut, "email", validationError);
    Helper.testStatusForField(sut, "password", validationError);
    Helper.testStatusForField(sut, "passwordConfirmation", validationError);
  });

  it("Should show name error if validation fails", () => {
    const validationError = faker.random.word();
    const { sut } = makeSut({ validationError });

    Helper.populateField(sut, "name");

    Helper.testStatusForField(sut, "name", validationError);
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

  it("Should show passwordConfirmation error if validation fails", () => {
    const validationError = faker.random.word();
    const { sut } = makeSut({ validationError });

    Helper.populateField(sut, "passwordConfirmation");

    Helper.testStatusForField(sut, "passwordConfirmation", validationError);
  });

  it("Should show valid name state if validation succeeds", () => {
    const { sut } = makeSut();

    Helper.populateField(sut, "name");

    Helper.testStatusForField(sut, "name");
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

  it("Should show valid passwordConfirmation state if validation succeeds", () => {
    const { sut } = makeSut();

    Helper.populateField(sut, "passwordConfirmation");

    Helper.testStatusForField(sut, "passwordConfirmation");
  });

  it("Should enable submit button if form is valid", () => {
    const { sut } = makeSut();

    Helper.populateField(sut, "name");
    Helper.populateField(sut, "email");
    Helper.populateField(sut, "password");
    Helper.populateField(sut, "passwordConfirmation");

    Helper.testIsButtonDisabled(sut, "submit", false);
  });

  it("Should show spinner on submit", async () => {
    const { sut } = makeSut();

    await simulateValidSubmit(sut);

    Helper.testElementExistance(sut, "spinner");
  });

  it("Should call AddAccount with correct values", async () => {
    const { sut, addAccountSpy } = makeSut();

    const name = faker.name.findName();
    const email = faker.internet.email();
    const password = faker.internet.password();

    await simulateValidSubmit(sut, name, email, password);

    expect(addAccountSpy.params).toEqual({
      name,
      email,
      password,
      passwordConfirmation: password,
    });
  });

  it("Should call AddAccount only once", async () => {
    const { sut, addAccountSpy } = makeSut();

    await simulateValidSubmit(sut);
    await simulateValidSubmit(sut);

    expect(addAccountSpy.callsCount).toBe(1);
  });

  it("Should not call AddAccount if form is invalid", async () => {
    const validationError = faker.random.word();
    const { sut, addAccountSpy } = makeSut({ validationError });

    await simulateValidSubmit(sut);

    expect(addAccountSpy.callsCount).toBe(0);
  });

  it("Should present error if AddAccount fails", async () => {
    const { sut, addAccountSpy } = makeSut();

    const error = new EmailInUseError();

    jest.spyOn(addAccountSpy, "add").mockRejectedValueOnce(error);

    await simulateValidSubmit(sut);

    testElementText(sut, "main-error", error.message);
    Helper.testChildCount(sut, "error-wrap", 1);
  });

  it("Should call SaveAccessToken on success", async () => {
    const { sut, addAccountSpy, saveAccessTokenMock } = makeSut();

    await simulateValidSubmit(sut);

    expect(saveAccessTokenMock.accessToken).toBe(
      addAccountSpy.account.accessToken
    );
    expect(history.location.pathname).toBe("/");
  });

  it("Should present error if SaveAccessToken fails", async () => {
    const { sut, saveAccessTokenMock } = makeSut();

    const error = new EmailInUseError();

    jest.spyOn(saveAccessTokenMock, "save").mockRejectedValueOnce(error);

    await simulateValidSubmit(sut);

    testElementText(sut, "main-error", error.message);
    Helper.testChildCount(sut, "error-wrap", 1);
  });

  it("Should go to login page", () => {
    const { sut } = makeSut();

    const loginLink = sut.getByTestId("login-link");
    fireEvent.click(loginLink);

    expect(history.location.pathname).toBe("/login");
  });
});
