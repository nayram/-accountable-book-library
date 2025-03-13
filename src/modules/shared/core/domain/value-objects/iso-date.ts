import { FieldValidationError } from '../field-validation-error';

export type ISODate = string;

function isValidDate(value: Date): boolean {
  return !isNaN(value.getTime());
}

function hasValidISOFormat(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function createISODate(value: string, fieldName: string): ISODate {
  if (!hasValidISOFormat(value.trim()) || !isValidDate(new Date(value.trim()))) {
    throw new FieldValidationError(`${fieldName} must be valid ISO date "YYYY-MM-DD"`);
  }

  return value.trim();
}

export function convertDateToISODateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
