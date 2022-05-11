import React from "react";
import {
  cleanup,
  fireEvent,
  render,
  RenderResult,
} from "@testing-library/react";
import Login from "./Login";
import { Validation } from "@/presentation/protocols/validation";
import { ValidationStub } from "@/presentation/test";
import faker from "@faker-js/faker";

type SutTypes = {
  sut: RenderResult;
  validationStub: Validation;
};

const makeSut = (): SutTypes => {
  const validationStub = new ValidationStub();

  validationStub.errorMessage = faker.random.words();

  const sut = render(<Login validation={validationStub} />);

  return {
    sut,
    validationStub,
  };
};

describe("Login page", () => {
  afterEach(cleanup);

  it("Should start with initial state", () => {
    const { sut, validationStub } = makeSut();

    const errorWrap = sut.getByTestId("error-wrap");
    expect(errorWrap.childElementCount).toBe(0);

    const submitButton = sut.getByTestId("submit") as HTMLButtonElement;
    expect(submitButton.disabled).toBe(true);

    const emailStatus = sut.getByTestId("email-status");
    expect(emailStatus.title).toBe(validationStub.errorMessage);
    expect(emailStatus.textContent).toBe("🔴");

    const passwordStatus = sut.getByTestId("password-status");
    expect(passwordStatus.title).toBe(validationStub.errorMessage);
    expect(passwordStatus.textContent).toBe("🔴");
  });

  it("Should show email error if validation fails", () => {
    const { sut, validationStub } = makeSut();

    const emailInput = sut.getByTestId("email");
    fireEvent.input(emailInput, {
      target: { value: faker.internet.email() },
    });

    const emailStatus = sut.getByTestId("email-status");

    expect(emailStatus.title).toBe(validationStub.errorMessage);
    expect(emailStatus.textContent).toBe("🔴");
  });

  it("Should show password error if validation fails", () => {
    const { sut, validationStub } = makeSut();

    const passwordInput = sut.getByTestId("password");
    fireEvent.input(passwordInput, {
      target: { value: faker.internet.password() },
    });

    const passwordStatus = sut.getByTestId("password-status");

    expect(passwordStatus.title).toBe(validationStub.errorMessage);
    expect(passwordStatus.textContent).toBe("🔴");
  });
});
