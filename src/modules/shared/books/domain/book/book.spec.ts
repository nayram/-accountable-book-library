import { Book, updateStatusToReserved } from '@modules/shared/books/domain/book/book';
import { BookStatus } from '@modules/shared/books/domain/book/book-status';
import { bookFixtures } from '@tests/utils/fixtures/books/book-fixtures';
import { faker } from '@faker-js/faker/locale/en';

import { getAvailableBooks } from './book';

describe('Book', () => {
  const systemDateTime = faker.date.recent();
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(systemDateTime);
  });

  afterEach(() => {
    jest.useRealTimers();
  });
  describe('getAvailableBooks', () => {
    it('should return only books with "available" status', () => {
      const numberOfAvailableBooks = 3;
      const books: Book[] = [
        ...bookFixtures.createMany({ book: { status: BookStatus.Available }, length: numberOfAvailableBooks }),
        ...bookFixtures.createMany({ book: { status: BookStatus.Borrowed } }),
        ...bookFixtures.createMany({ book: { status: BookStatus.Reserved } }),
      ];
      const availableBooks = getAvailableBooks(books);

      expect(availableBooks.length).toBe(numberOfAvailableBooks);

      availableBooks.forEach((book) => {
        expect(book.status).toBe(BookStatus.Available);
      });
    });

    it('should return an empty array when no books are available', () => {
      const books: Book[] = [
        ...bookFixtures.createMany({ book: { status: BookStatus.Reserved } }),
        ...bookFixtures.createMany({ book: { status: BookStatus.Borrowed } }),
      ];

      const availableBooks = getAvailableBooks(books);

      expect(availableBooks).toEqual([]);
      expect(availableBooks.length).toBe(0);
    });
  });

  describe('updateStatusToReserved', () => {
    it('should update book status to reserved', () => {
      const book = bookFixtures.create({ status: BookStatus.Available });
      expect(updateStatusToReserved(book).status).toBe(BookStatus.Reserved);
    });

    it('should update the updatedAt timestamp', () => {
      const book = bookFixtures.create({ status: BookStatus.Available, updatedAt: faker.date.past() });
      const updatedBook = updateStatusToReserved(book);
      expect(updatedBook.updatedAt).toEqual(systemDateTime);
      expect(updatedBook.updatedAt).not.toEqual(book.updatedAt);
      expect(updatedBook.status).toBe(BookStatus.Reserved);
    });
  });
});
