import { InvalidFieldError, RequiredFieldError } from "../../errors";
import { FieldValidation } from "../../protocols/field-validation";

export class CompareFieldsValidation implements FieldValidation {
    constructor(
        readonly field: string,
        private readonly valueToCompare: string,
    ) {}

    validate(value: string): Error | null {
        return value !== this.valueToCompare ? new InvalidFieldError() : null;
    }
}
