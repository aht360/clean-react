import { InvalidFieldError } from "@/validation/errors"
import faker from "@faker-js/faker"
import { EmailValidation } from "./email-validation"

describe('Email validation', () => {
    it('Should return error if email is invalid', () => {
        const sut = new EmailValidation(faker.random.word())
        const error = sut.validate(faker.random.word())
        expect(error).toEqual(new InvalidFieldError())
    })

    it('Should return falsy if email is valid', () => {
        const sut = new EmailValidation(faker.random.word())
        const error = sut.validate(faker.internet.email())
        expect(error).toBeFalsy()
    })
})
