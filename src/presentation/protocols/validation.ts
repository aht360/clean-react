export interface Validation {
  errorMessage: string;
  validate(fieldName: string, input: object): string;
}
