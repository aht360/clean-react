import { render, RenderResult } from "@testing-library/react";
import React from "react";
import SignUp from "./Signup";

type SutTypes = {
  sut: RenderResult;
};

const makeSut = (): SutTypes => {
  const sut = render(<SignUp />);

  return {
    sut,
  };
};

const testChildCount = (
  sut: RenderResult,
  fieldName: string,
  count: number
): void => {
  const el = sut.getByTestId(fieldName);
  expect(el.childElementCount).toBe(count);
};

const testIsButtonDisabled = (
  sut: RenderResult,
  fieldName: string,
  isDisabled: boolean
): void => {
  const button = sut.getByTestId(fieldName) as HTMLButtonElement;
  expect(button.disabled).toBe(isDisabled);
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

describe("Signup component", () => {
  test("Should start with initial state", () => {
    const { sut } = makeSut();

    const validationError = "Campo obrigatório";

    testChildCount(sut, "error-wrap", 0);

    testIsButtonDisabled(sut, "submit", true);

    testStatusForField(sut, "name", validationError);
    testStatusForField(sut, "email", validationError);
    testStatusForField(sut, "password", validationError);
    testStatusForField(sut, "passwordConfirmation", validationError);
  });
});
