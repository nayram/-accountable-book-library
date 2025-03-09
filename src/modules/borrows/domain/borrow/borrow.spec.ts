import { faker } from '@faker-js/faker/locale/en';

import { borrowFixtures } from '@tests/utils/fixtures/borrows/borrow-fixtures';
import { referenceIdFixtures } from '@tests/utils/fixtures/references/reference-id-fixtures';

import { Borrow, isValidBorrow } from './borrow';

describe('Borrow', () => {
  describe('isValidBorrow', () => {
    it('should return true when borrow is valid (within limit and no same reference)', () => {
      const borrows = borrowFixtures.createMany({ borrow: { returnDate: null }, length: 2 });

      const result = isValidBorrow(borrows, referenceIdFixtures.create());
      expect(result.isValid).toBe(true);
    });

    it('should return false when borrow limit is reached', () => {
      const borrows = borrowFixtures.createMany({ borrow: { returnDate: null }, length: 3 });
      const result = isValidBorrow(borrows, referenceIdFixtures.create());
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe('Borrow limit reached');
    });

    it('should return false when already borrowed book with the same reference', () => {
      const referenceId = referenceIdFixtures.create();
      const borrows = [
        ...borrowFixtures.createMany({ borrow: { returnDate: faker.date.recent() }, length: 2 }),
        borrowFixtures.create({ returnDate: null, referenceId }),
      ];

      const result = isValidBorrow(borrows, referenceId);
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe('Already borrowed book with the same reference');
    });

    it('should return true when the same referenceId is borrowed but already returned', () => {
      const referenceId = referenceIdFixtures.create();
      const borrows = [
        borrowFixtures.create({ referenceId, returnDate: faker.date.recent() }),
        borrowFixtures.create({ returnDate: null }),
      ];

      const result = isValidBorrow(borrows, referenceId);
      expect(result.isValid).toBe(true);
    });

    it('should handle empty borrows array correctly', () => {
      const borrows: Borrow[] = [];
      const referenceId = referenceIdFixtures.create();
      const result = isValidBorrow(borrows, referenceId);
      expect(result.isValid).toBe(true);
    });
  });
});
