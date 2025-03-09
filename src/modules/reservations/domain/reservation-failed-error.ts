import { BookId } from '@modules/shared/books/domain/book/book-id';

export class ReservationFailedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ReservationFailedError';
  }

  static withBookId(bookId: BookId) {
    return new ReservationFailedError(`book with id ${bookId} is not available`);
  }
}
