import { FieldValidationError } from '../field-validation-error';

import { createUuid } from './uuid';

describe('uuid', () => {
  it('should throw FieldValidationError when provided an invalid UUID v4', () => {
    ['', '1234567', 'random-value', 'abd-adb-basdf'].forEach((uuid) => {
      expect(() => createUuid(uuid, 'uuid')).toThrow(FieldValidationError);
    });
  });

  it('should create a uuid', () => {
    const uuid = '7e58d3ab-d97a-4ce1-9ed0-ece566422bd7';
    expect(createUuid(uuid, 'uuid')).toEqual(uuid);
  });
});
