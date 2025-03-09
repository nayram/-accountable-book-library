import { faker } from '@faker-js/faker/locale/en';

import { updateStatusToReserved, updateStatusToBorrowed } from '@modules/shared/books/domain/book/book';
import { BookStatus } from '@modules/shared/books/domain/book/book-status';
import { bookFixtures } from '@tests/utils/fixtures/books/book-fixtures';

describe('Book', () => {
  const systemDateTime = faker.date.recent();
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(systemDateTime);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('updateStatusToReserved', () => {
    it('should update book status to reserved', () => {
      const initialBook = bookFixtures.create({ status: BookStatus.Available });
      const updatedBook = updateStatusToReserved(initialBook);

      expect(updatedBook.status).toBe(BookStatus.Reserved);

      expect(updatedBook.id).toBe(initialBook.id);
      expect(updatedBook.referenceId).toBe(initialBook.referenceId);
      expect(updatedBook.barcode).toBe(initialBook.barcode);
      expect(updatedBook.createdAt).toBe(initialBook.createdAt);
    });

    it('should update the updatedAt timestamp field to the future', () => {
      const date = faker.date.past();

      const initialBook = bookFixtures.create({ status: BookStatus.Available, createdAt: date, updatedAt: date });

      const updatedBook = updateStatusToReserved(initialBook);

      expect(updatedBook.updatedAt.getTime()).toBeGreaterThan(initialBook.updatedAt.getTime());

      expect(updatedBook.id).toBe(initialBook.id);
      expect(updatedBook.referenceId).toBe(initialBook.referenceId);
      expect(updatedBook.barcode).toBe(initialBook.barcode);
      expect(updatedBook.createdAt).toBe(initialBook.createdAt);
    });
  });

  describe('updateStatusToBorrowed', () => {
    it('should update the book status to Borrowed', () => {
      const initialBook = bookFixtures.create();

      const updatedBook = updateStatusToBorrowed(initialBook);

      expect(updatedBook.status).toBe(BookStatus.Borrowed);

      expect(updatedBook.id).toBe(initialBook.id);
      expect(updatedBook.referenceId).toBe(initialBook.referenceId);
      expect(updatedBook.barcode).toBe(initialBook.barcode);
      expect(updatedBook.createdAt).toBe(initialBook.createdAt);
    });

    it('should update the updatedAt timestamp field to the future', () => {
      const date = faker.date.past();

      const initialBook = bookFixtures.create({ status: BookStatus.Available, createdAt: date, updatedAt: date });
      const updatedBook = updateStatusToBorrowed(initialBook);

      expect(updatedBook.updatedAt.getTime()).toBeGreaterThan(initialBook.updatedAt.getTime());

      expect(updatedBook.id).toBe(initialBook.id);
      expect(updatedBook.referenceId).toBe(initialBook.referenceId);
      expect(updatedBook.barcode).toBe(initialBook.barcode);
      expect(updatedBook.createdAt).toBe(initialBook.createdAt);
    });
  });
});
