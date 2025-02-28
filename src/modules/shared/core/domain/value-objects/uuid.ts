import { FieldValidationError } from '../field-validation-error';

export type Uuid = string;

export function createUuid(uuid: string, fieldName: string): Uuid {
  if (!isUuidV4(uuid)) {
    throw new FieldValidationError(`${fieldName} must be a uuid v4`);
  }

  return uuid;
}

function isUuidV4(value: string): boolean {
  const uuidv4 =
    /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
  return uuidv4.test(value);
}
