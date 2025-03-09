import { BookId } from '@modules/shared/books/domain/book/book-id';
import { UserId } from '@modules/shared/users/domain/user/user-id';

export class BorrowFailedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BorrowFailedError';
  }
  static withBookId(bookId: BookId) {
    return new BorrowFailedError(`book with id ${bookId} does not exist`);
  }
  static withUserId(userId: UserId) {
    return new BorrowFailedError(`user with id ${userId} has has hit the borrow limit`);
  }
}
