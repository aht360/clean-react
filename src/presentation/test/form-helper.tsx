import faker from "@faker-js/faker";
import { fireEvent, RenderResult, waitFor } from "@testing-library/react";

export const testChildCount = (
  sut: RenderResult,
  fieldName: string,
  count: number
): void => {
  const el = sut.getByTestId(fieldName);
  expect(el.childElementCount).toBe(count);
};

export const testIsButtonDisabled = (
  sut: RenderResult,
  fieldName: string,
  isDisabled: boolean
): void => {
  const button = sut.getByTestId(fieldName) as HTMLButtonElement;
  expect(button.disabled).toBe(isDisabled);
};

export const testStatusForField = (
  sut: RenderResult,
  fieldName: string,
  validationError?: string
): void => {
  const fieldStatus = sut.getByTestId(`${fieldName}-status`);
  expect(fieldStatus.title).toBe(validationError || "Ok");
  expect(fieldStatus.textContent).toBe(validationError ? "🔴" : "🟢");
};

export const populateField = (
  sut: RenderResult,
  fieldName: string,
  value = faker.random.word()
): void => {
  const input = sut.getByTestId(fieldName);
  fireEvent.input(input, {
    target: { value },
  });
};

export const testElementExistance = (
  sut: RenderResult,
  fieldName: string
): void => {
  const el = sut.getByTestId(fieldName);
  expect(el).toBeTruthy();
};

export const testElementText = async (
  sut: RenderResult,
  fieldName: string,
  text: string
): Promise<void> => {
  const el = await waitFor(() => sut.getByTestId(fieldName));
  expect(el.textContent).toBe(text);
};
