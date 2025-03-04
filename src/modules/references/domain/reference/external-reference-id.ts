import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';
import { createString } from '@modules/shared/core/domain/value-objects/string';

export type ExternalReferenceId = string;

export function createExternalReferenceId(value: string): ExternalReferenceId {
  const externalReferenceId = createString(value, 'external reference id');
  if (externalReferenceId.length < 5) {
    throw new FieldValidationError(`${externalReferenceId} is not a valid reference id`);
  }
  return externalReferenceId;
}
