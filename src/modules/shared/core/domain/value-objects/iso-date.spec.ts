import { FieldValidationError } from '../field-validation-error';

import { createISODate } from './iso-date';

describe('iso date', () => {
  describe('should throw FieldValidationError', () => {
    it('when a date was not provided', () => {
      ['', ' ', 'invalid-date', '1234', 'true'].forEach((date) => {
        expect(() => createISODate(date, 'field')).toThrow(FieldValidationError);
      });
    });

    it('when provided a date in a different format than "YYYY-MM-DD"', () => {
      ['2024-01-01 00:00:00', '2024-01-01T00:00:00.000Z', '2023 11 01', '2023/11/01'].forEach((date) => {
        expect(() => createISODate(date, 'field')).toThrow(FieldValidationError);
      });
    });

    it('when provided an invalid ISO date', () => {
      const date = '0000-33-44';
      expect(() => createISODate(date, 'field')).toThrow(FieldValidationError);
    });
  });

  it('should create an ISO date "YYYY-MM-DD"', () => {
    ['2024-01-01', '   2024-01-01', '  2024-01-01  '].forEach((date) => {
      expect(createISODate(date, 'field')).toEqual(date.trim());
    });
  });
});
