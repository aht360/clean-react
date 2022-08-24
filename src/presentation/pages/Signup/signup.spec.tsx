import {
  cleanup,
  fireEvent,
  render,
  RenderResult,
} from "@testing-library/react";
import React from "react";
import SignUp from "./Signup";
import { Helper, ValidationStub } from "@/presentation/test";
import faker from "@faker-js/faker";

type SutTypes = {
  sut: RenderResult;
};

type SutParams = {
  validationError: string;
};

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  validationStub.errorMessage = params?.validationError;

  const sut = render(<SignUp validation={validationStub} />);

  return {
    sut,
  };
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
    Helper.testStatusForField(sut, "passwordConfirmation", "Campo obrigatório");
  });

  it("Should show name error if validation fails", () => {
    const validationError = "uma palabra";
    const { sut } = makeSut({ validationError });

    Helper.populateField(sut, "name");

    Helper.testStatusForField(sut, "name", validationError);
  });

  it("Should show email error if validation fails", () => {
    const validationError = "uma palabra";
    const { sut } = makeSut({ validationError });

    Helper.populateField(sut, "email");

    Helper.testStatusForField(sut, "email", validationError);
  });

  it("Should show password error if validation fails", () => {
    const validationError = "uma palabra";
    const { sut } = makeSut({ validationError });

    Helper.populateField(sut, "password");

    Helper.testStatusForField(sut, "password", validationError);
  });
});
