import { FieldValidationError } from '../field-validation-error'

export type PositiveInt = number

function isNumber(value: unknown): value is number {
  return typeof value === 'number'
}

export function createPositiveInt(int: number, fieldName: string): PositiveInt {
  if (!isNumber(int) || int < 0) {
    throw new FieldValidationError(`${fieldName} must be a positive integer`)
  }

  return int
}
