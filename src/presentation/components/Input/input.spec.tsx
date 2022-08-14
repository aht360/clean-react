import React from "react";
import { render, RenderResult } from "@testing-library/react";
import Input from "./Input";
import Context from "@/presentation/contexts/form/formContext";

const makeSut = (): RenderResult => {
  return render(
    <Context.Provider value={{ state: {} }}>
      <Input name="field" />
    </Context.Provider>
  );
};

describe("Input Component", () => {
  test("Should begin with readOnly", () => {
    const sut = makeSut();
    const input = sut.getByTestId("field") as HTMLInputElement;
    expect(input.readOnly).toBeTruthy();
  });
});
