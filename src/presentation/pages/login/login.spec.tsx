import React from "react";
import { render } from "@testing-library/react";
import Login from "./Login";

describe("Login page", () => {
  it("Should not render spinner and error on start", () => {
    const { getByTestId } = render(<Login />);
    const errorWrap = getByTestId("error-wrap");
    expect(errorWrap.childElementCount).toBe(0);
  });
});
