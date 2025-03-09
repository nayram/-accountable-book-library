import { Entity } from '@modules/shared/core/domain/entity';
import { createUserId, UserId } from '@modules/shared/users/domain/user/user-id';
import { BookId, createBookId } from '@modules/shared/books/domain/book/book-id';
import { createReferenceId, ReferenceId } from '@modules/shared/references/domain/reference-id';

import { BorrowId, createBorrowId } from './borrow-id';
import { createBorrowDueData } from './borrow-due-date';

export const borrowLimit = 3;

export type Borrow = Entity<{
  id: BorrowId;
  userId: UserId;
  bookId: BookId;
  referenceId: ReferenceId;
  borrowDate: Date;
  dueDate: Date;
  returnDate: Date | null;
  updatedAt: Date;
}>;

interface BorrowPrimitive {
  id: string;
  userId: string;
  bookId: string;
  referenceId: string;
  dueDate: Date;
}

export function createBorrow({ id, userId, bookId, dueDate, referenceId }: BorrowPrimitive): Borrow {
  const now = new Date();
  return {
    id: createBorrowId(id),
    userId: createUserId(userId),
    bookId: createBookId(bookId),
    referenceId: createReferenceId(referenceId),
    dueDate: createBorrowDueData(dueDate),
    returnDate: null,
    borrowDate: now,
    updatedAt: now,
  };
}

export function isValidBorrow(borrows: Borrow[], referenceId: ReferenceId): { isValid: boolean; reason?: string } {
  const currentlyBorrowedBooks = borrows.filter((borrow) => borrow.returnDate === null);

  if (currentlyBorrowedBooks.length >= borrowLimit) {
    return { isValid: false, reason: 'Borrow limit reached' };
  }

  if (currentlyBorrowedBooks.some((borrow) => borrow.referenceId === referenceId)) {
    return { isValid: false, reason: 'Already borrowed book with the same reference' };
  }

  return { isValid: true };
}
