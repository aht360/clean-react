import {
  cleanup,
  fireEvent,
  render,
  RenderResult,
  waitFor,
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
});
