import React from "react";
import {
  cleanup,
  fireEvent,
  render,
  RenderResult,
} from "@testing-library/react";
import Login from "./Login";
import { Validation } from "@/presentation/protocols/validation";
import { ValidationSpy } from "@/presentation/test";
import faker from "@faker-js/faker";

type SutTypes = {
  sut: RenderResult;
  validationSpy: Validation;
};

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy();

  validationSpy.errorMessage = faker.random.words();

  const sut = render(<Login validation={validationSpy} />);

  return {
    sut,
    validationSpy,
  };
};

describe("Login page", () => {
  afterEach(cleanup);

  it("Should start with initial state", () => {
    const { sut, validationSpy } = makeSut();

    const errorWrap = sut.getByTestId("error-wrap");
    expect(errorWrap.childElementCount).toBe(0);

    const submitButton = sut.getByTestId("submit") as HTMLButtonElement;
    expect(submitButton.disabled).toBe(true);

    const emailStatus = sut.getByTestId("email-status");
    expect(emailStatus.title).toBe(validationSpy.errorMessage);
    expect(emailStatus.textContent).toBe("🔴");

    const passwordStatus = sut.getByTestId("password-status");
    expect(passwordStatus.title).toBe("Campo obrigatório");
    expect(passwordStatus.textContent).toBe("🔴");
  });

  it("Should call Validation with correct email", () => {
    const { sut, validationSpy } = makeSut();
    const email = faker.internet.email();

    const emailInput = sut.getByTestId("email");
    fireEvent.input(emailInput, { target: { value: email } });

    expect(validationSpy.fieldName).toBe("email");
    expect(validationSpy.fieldValue).toBe(email);
  });

  it("Should call Validation with correct password", () => {
    const { sut, validationSpy } = makeSut();
    const password = faker.internet.password();

    const passwordInput = sut.getByTestId("password");
    fireEvent.input(passwordInput, { target: { value: password } });

    expect(validationSpy.fieldName).toBe("password");
    expect(validationSpy.fieldValue).toBe(password);
  });

  it("Should show email error if validation fails", () => {
    const { sut, validationSpy } = makeSut();

    const passwordInput = sut.getByTestId("email");
    fireEvent.input(passwordInput, {
      target: { value: faker.internet.email() },
    });

    const emailStatus = sut.getByTestId("email-status");

    expect(emailStatus.title).toBe(validationSpy.errorMessage);
    expect(emailStatus.textContent).toBe("🔴");
  });
});
