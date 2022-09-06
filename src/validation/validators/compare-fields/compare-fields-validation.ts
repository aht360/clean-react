import { InvalidFieldError, RequiredFieldError } from "../../errors";
import { FieldValidation } from "../../protocols/field-validation";

export class CompareFieldsValidation implements FieldValidation {
  constructor(
    readonly field: string,
    private readonly fieldToCompare: string
  ) {}

  validate(input: object): Error | null {
    return input[this.field] !== input[this.fieldToCompare]
      ? new InvalidFieldError()
      : null;
  }
}
