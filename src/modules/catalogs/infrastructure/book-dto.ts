import { Book } from '../domain/book/book';

import { BookDTO } from './book-model';

export function fromDTO(dto: BookDTO): Book {
  return {
    id: String(dto._id).toString(),
    referenceId: dto.reference_id,
    title: dto.title,
    author: dto.author,
    publisher: dto.publisher,
    publicationYear: dto.publication_year,
    quantity: dto.quantity,
    price: dto.price,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

export function toDTO(book: Book) {
  return {
    _id: book.id,
    reference_id: book.referenceId,
    title: book.title,
    author: book.author,
    publisher: book.publisher,
    publication_year: book.publicationYear,
    quantity: book.quantity,
    price: book.price,
    created_at: book.createdAt,
    updated_at: book.updatedAt,
  };
}
