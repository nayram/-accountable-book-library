import { Entity } from '@modules/shared/core/domain/entity';
import { createReferenceId, ReferenceId } from '@modules/shared/references/domain/reference-id';

import { BookId, createBookId } from './book-id';
import { BookStatus, createBookStatus } from './book-status';
import { Barcode, createBarcode } from './bar-code';

export const defaultNumberOfBooks = 4;

export type Book = Entity<{
  id: BookId;
  referenceId: ReferenceId;
  barcode: Barcode;
  status: BookStatus;
  createdAt: Date;
  updatedAt: Date;
}>;

export function create({
  id,
  referenceId,
  barcode,
  status,
}: {
  id: string;
  referenceId: string;
  barcode: string;
  status: string;
}): Book {
  const now = new Date();
  return {
    id: createBookId(id),
    referenceId: createReferenceId(referenceId),
    status: createBookStatus(status),
    barcode: createBarcode(barcode),
    createdAt: now,
    updatedAt: now,
  };
}

export function getAvailableBooks(books: Book[]): Book[] {
  return books.filter((book) => book.status === BookStatus.Available);
}

export function updateStatusToReserved(book: Book): Book {
  return {
    ...book,
    status: BookStatus.Reserved,
    updatedAt: new Date(),
  };
}

export function updateStatusToBorrowed(book: Book): Book {
  return {
    ...book,
    status: BookStatus.Borrowed,
    updatedAt: new Date(),
  };
}
