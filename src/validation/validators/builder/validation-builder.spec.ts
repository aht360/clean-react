import { EmailValidation } from "../email/email-validation";
import { RequiredFieldValidation } from "../required-field/required-field-validation";
import { ValidationBuilder } from "./validation-builder";

describe('ValidationBuilder', () => {
    test('Should return RequiredFieldValidation', () => {
        const validations = ValidationBuilder.field('any_field').required().build();

        expect(validations).toEqual([new RequiredFieldValidation('any_field')])
    })

    test('Should return EmailValidation', () => {
        const validations = ValidationBuilder.field('any_field').email().build();

        expect(validations).toEqual([new EmailValidation('any_field')])
    })
})
