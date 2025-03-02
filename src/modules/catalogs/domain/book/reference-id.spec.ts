import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';
import { referenceIdFixtures } from '@tests/utils/fixtures/catalog/reference-fixtures';

import { createReferenceId } from './reference-id';

describe('reference id', () => {
  it('should throw FieldValidationError when length is less than 5', () => {
    expect(() => createReferenceId(referenceIdFixtures.invalid())).toThrow(FieldValidationError);
  });

  it('should create refrence id', () => {
    const referenceId = referenceIdFixtures.create();
    expect(createReferenceId(referenceId)).toEqual(referenceId);
  });
});
