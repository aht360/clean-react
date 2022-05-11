import React from "react";
import {
  cleanup,
  fireEvent,
  render,
  RenderResult,
} from "@testing-library/react";
import Login from "./Login";
import { AuthenticationSpy, ValidationStub } from "@/presentation/test";
import faker from "@faker-js/faker";

type SutTypes = {
  sut: RenderResult;
  authenticationSpy: AuthenticationSpy;
};

type SutParams = {
  validationError: string;
};

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  validationStub.errorMessage = params?.validationError;

  const authenticationSpy = new AuthenticationSpy();

  const sut = render(
    <Login validation={validationStub} authentication={authenticationSpy} />
  );

  return {
    sut,
    authenticationSpy,
  };
};

describe("Login page", () => {
  afterEach(cleanup);

  it("Should start with initial state", () => {
    const validationError = faker.random.word();
    const { sut } = makeSut({ validationError });

    const errorWrap = sut.getByTestId("error-wrap");
    expect(errorWrap.childElementCount).toBe(0);

    const submitButton = sut.getByTestId("submit") as HTMLButtonElement;
    expect(submitButton.disabled).toBe(true);

    const emailStatus = sut.getByTestId("email-status");
    expect(emailStatus.title).toBe(validationError);
    expect(emailStatus.textContent).toBe("🔴");

    const passwordStatus = sut.getByTestId("password-status");
    expect(passwordStatus.title).toBe(validationError);
    expect(passwordStatus.textContent).toBe("🔴");
  });

  it("Should show email error if validation fails", () => {
    const validationError = faker.random.word();
    const { sut } = makeSut({ validationError });

    const emailInput = sut.getByTestId("email");
    fireEvent.input(emailInput, {
      target: { value: faker.internet.email() },
    });

    const emailStatus = sut.getByTestId("email-status");

    expect(emailStatus.title).toBe(validationError);
    expect(emailStatus.textContent).toBe("🔴");
  });

  it("Should show password error if validation fails", () => {
    const validationError = faker.random.word();
    const { sut } = makeSut({ validationError });

    const passwordInput = sut.getByTestId("password");
    fireEvent.input(passwordInput, {
      target: { value: faker.internet.password() },
    });

    const passwordStatus = sut.getByTestId("password-status");

    expect(passwordStatus.title).toBe(validationError);
    expect(passwordStatus.textContent).toBe("🔴");
  });

  it("Should show valid password state if validation succeeds", () => {
    const { sut } = makeSut();

    const passwordInput = sut.getByTestId("password");
    fireEvent.input(passwordInput, {
      target: { value: faker.internet.password() },
    });

    const passwordStatus = sut.getByTestId("password-status");

    expect(passwordStatus.title).toBe("Ok");
    expect(passwordStatus.textContent).toBe("🟢");
  });

  it("Should show valid email state if validation succeeds", () => {
    const { sut } = makeSut();

    const emailInput = sut.getByTestId("email");
    fireEvent.input(emailInput, {
      target: { value: faker.internet.email() },
    });

    const emailStatus = sut.getByTestId("email-status");

    expect(emailStatus.title).toBe("Ok");
    expect(emailStatus.textContent).toBe("🟢");
  });

  it("Should enable submit button if form is valid", () => {
    const { sut } = makeSut();

    const emailInput = sut.getByTestId("email");
    fireEvent.input(emailInput, {
      target: { value: faker.internet.email() },
    });

    const passwordInput = sut.getByTestId("password");
    fireEvent.input(passwordInput, {
      target: { value: faker.internet.password() },
    });

    const submitButton = sut.getByTestId("submit") as HTMLButtonElement;

    expect(submitButton.disabled).toBe(false);
  });

  it("Should show spinner on submit", () => {
    const { sut } = makeSut();

    const emailInput = sut.getByTestId("email");
    fireEvent.input(emailInput, {
      target: { value: faker.internet.email() },
    });

    const passwordInput = sut.getByTestId("password");
    fireEvent.input(passwordInput, {
      target: { value: faker.internet.password() },
    });

    const submitButton = sut.getByTestId("submit");

    fireEvent.click(submitButton);

    const spinner = sut.getByTestId("spinner");

    expect(spinner).toBeTruthy();
  });

  it("Should call authentication with correct values", () => {
    const { sut, authenticationSpy } = makeSut();

    const email = faker.internet.email();
    const emailInput = sut.getByTestId("email");
    fireEvent.input(emailInput, {
      target: { value: email },
    });

    const password = faker.internet.password();
    const passwordInput = sut.getByTestId("password");
    fireEvent.input(passwordInput, {
      target: { value: password },
    });

    const submitButton = sut.getByTestId("submit");
    fireEvent.click(submitButton);

    expect(authenticationSpy.params).toEqual({
      email,
      password,
    });
  });
});
