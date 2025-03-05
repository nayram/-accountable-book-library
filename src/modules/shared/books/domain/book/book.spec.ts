import { bookFixtures } from '@tests/utils/fixtures/books/book-fixtures';

import { Book, getAvailableBooks } from './book';
import { BookStatus } from './book-status';

describe('Book', () => {
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
});
