import { uuidFixtures } from '@tests/utils/fixtures/shared/uuid-fixtures';

import { FieldValidationError } from './field-validation-error';
import { createPagination } from './pagination';

describe('Pagination', () => {
  describe('cursor', () => {
    it('should throw a FieldValidationError if cursor is not uuid', () => {
      expect(() => createPagination({ cursor: 'cursor', limit: 10 })).toThrow(FieldValidationError);
    });
    it('should not throw an error when cursor is not provided', () => {
      expect(() => createPagination({ limit: 10 })).not.toThrow(FieldValidationError);
    });
  });

  describe('limit', () => {
    it('should throw a FieldValidationError if limit is not greater than 0', () => {
      expect(() => createPagination({ cursor: uuidFixtures.create(), limit: 0 })).toThrow(FieldValidationError);
      expect(() => createPagination({ cursor: uuidFixtures.create(), limit: 0 })).toThrow(
        `limit must be greater than 0`,
      );
    });
  });

  it('should create pagination', () => {
    const limit = 10;
    const cursor = uuidFixtures.create();
    expect(createPagination({ cursor, limit })).toEqual({ cursor, limit });
  });
});
