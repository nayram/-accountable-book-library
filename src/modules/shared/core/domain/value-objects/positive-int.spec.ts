import { FieldValidationError } from '../field-validation-error';

import { createPositiveInt } from './positive-int';

describe('createPositiveInt', () => {
  it('should throw FieldValidationError when provided an invalid int', () => {
    [-1, -1.5].forEach((int) => {
      expect(() => createPositiveInt(int, 'field')).toThrow(FieldValidationError);
      expect(() => createPositiveInt(int, 'field')).toThrow('field must be a positive integer');
    });
  });

  it('should throw FieldValidationError when input is not an integer', () => {
    expect(() => createPositiveInt('1' as unknown as number, 'field')).toThrow(FieldValidationError);
  });

  it('should create a positive int', () => {
    const int = 0;
    expect(createPositiveInt(int, 'field')).toEqual(int);
  });
});
