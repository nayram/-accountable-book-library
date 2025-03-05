import { FieldValidationError } from '../field-validation-error';

import { createInteger } from './integer';

describe('createInteger', () => {
  it('should throw FieldValidationError when input is not an integer', () => {
    expect(() => createInteger('1' as unknown as number, 'field')).toThrow(FieldValidationError);
  });

  it('should create a integer', () => {
    [1, -1, 0, 0.5, -0.5].forEach((int) => {
      expect(createInteger(int, 'field')).toEqual(int);
    });
  });
});
