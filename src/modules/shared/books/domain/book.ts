import { Entity } from '@modules/shared/core/domain/entity';
import { ReferenceId } from '@modules/shared/references/domain/reference-id';

import { BookId } from './book-id';
import { BookStatus } from './book-status';

export type Book = Entity<{
  id: BookId;
  referenceId: ReferenceId;
  status: BookStatus;
  createdAt: Date;
  updatedAt: Date;
}>;
