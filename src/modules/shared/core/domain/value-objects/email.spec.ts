import { FieldValidationError } from '../field-validation-error';

import { createEmail } from './email';

describe('email', () => {
  describe('should throw FieldValidationError', () => {
    it('when is an empty string', () => {
      expect(() => createEmail('', 'email')).toThrow(FieldValidationError);
    });

    it('when is not a valid email', () => {
      [
        '@',
        'john.doe@',
        '@accountable.io',
        'john.doe@accountable',
        'john.doe@accountable.',
        'john.doe@@accountable.com',
        'john.doe@foo@accountable.com',
      ].forEach((email) => {
        expect(() => createEmail(email, 'email')).toThrow(FieldValidationError);
      });
    });
  });

  it('should create user email', () => {
    const email = 'john.doe@accountable.com';
    expect(createEmail(email, 'email')).toEqual(email);
  });
});
