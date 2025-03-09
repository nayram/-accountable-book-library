import { BookId } from '@modules/shared/books/domain/book/book-id';

export class ReservationFailedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ReservationFailedError';
  }

  static withBookId(bookId: BookId) {
    return new ReservationFailedError(`book with id ${bookId} is not available`);
  }
  static withBorrowBook() {
    return new ReservationFailedError('Failed to complete borrow action');
  }
  static inValidStatus() {
    return new ReservationFailedError('Invalid reservation status');
  }

  static withUserId() {
    return new ReservationFailedError('Invalid user request');
  }
}
