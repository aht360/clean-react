import { InvalidFieldError, RequiredFieldError } from "../../errors";
import { FieldValidation } from "../../protocols/field-validation";

export class CompareFieldsValidation implements FieldValidation {
    constructor(
        readonly field: string,
        private readonly valueToCompare: string,
    ) {}

    validate(value: string): Error {
        return new InvalidFieldError()
    }
}
