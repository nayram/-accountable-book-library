import { Schema } from 'mongoose';

import { Book } from '../domain/book/book';

import { BookDTO } from './book-model';

export function toDTO(book: Book): BookDTO {
  return {
    _id: book.id as unknown as Schema.Types.UUID,
    reference_id: book.referenceId as unknown as Schema.Types.UUID,
    status: book.status,
    created_at: book.createdAt,
    updated_at: book.updatedAt,
  };
}
