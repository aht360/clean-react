export interface Validation {
    fieldName: string;
    fieldValue: string;
    errorMessage: string;
    validate(fieldName: string, fieldValue: string): string;
}
