import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';
import { createString } from '@modules/shared/core/domain/value-objects/string';

export type Barcode = string;

export function createBarcode(value: string) {
  const code = createString(value, 'barcode');
  if (code.length < 12) {
    throw new FieldValidationError(`${value} is not a valid barcode`);
  }
  return code;
}
