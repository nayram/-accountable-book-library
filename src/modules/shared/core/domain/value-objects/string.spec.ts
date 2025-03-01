import { FieldValidationError } from '../field-validation-error';

import { createString } from './string';

describe('string', () => {
  it('should throw FieldValidationError when is an empty string', () => {
    expect(() => createString('', 'string')).toThrow(FieldValidationError);
  });

  it('should create string', () => {
    const string = 'one simple string';
    expect(createString(string, 'string')).toEqual(string);
  });

  it('should trim string', () => {
    const string = '  one simple string  ';
    expect(createString(string, 'string')).toEqual('one simple string');
  });
});
