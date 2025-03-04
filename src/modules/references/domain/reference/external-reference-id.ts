import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';
import { createString } from '@modules/shared/core/domain/value-objects/string';

export type ExternalReferenceId = string;

export function createExternalReferenceId(value: string): ExternalReferenceId {
  if (value.length < 5) {
    throw new FieldValidationError(`${value} is not a valid reference id`);
  }
  return createString(value, 'external reference id');
}
