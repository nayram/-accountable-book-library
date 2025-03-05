import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';
import { externalReferenceIdFixtures } from '@tests/utils/fixtures/references/external-reference-id-fixtures';

import { createExternalReferenceId } from './external-reference-id';

describe('external reference id', () => {
  it('should throw FieldValidationError when length is less than 5', () => {
    expect(() => createExternalReferenceId(externalReferenceIdFixtures.invalid())).toThrow(FieldValidationError);
  });

  it('should create refrence id', () => {
    const referenceId = externalReferenceIdFixtures.create();
    expect(createExternalReferenceId(referenceId)).toEqual(referenceId);
  });
});
