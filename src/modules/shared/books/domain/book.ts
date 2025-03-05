import { Entity } from '@modules/shared/core/domain/entity';
import { createReferenceId, ReferenceId } from '@modules/shared/references/domain/reference-id';

import { BookId, createBookId } from './book-id';
import { BookStatus } from './book-status';

export const defaultNumberOfBooks = 4;

export type Book = Entity<{
  id: BookId;
  referenceId: ReferenceId;
  status: BookStatus;
  createdAt: Date;
  updatedAt: Date;
}>;

export function create({ id, referenceId }: { id: string; referenceId: string }): Book {
  const now = new Date();
  return {
    id: createBookId(id),
    referenceId: createReferenceId(referenceId),
    status: BookStatus.Available,
    createdAt: now,
    updatedAt: now,
  };
}
