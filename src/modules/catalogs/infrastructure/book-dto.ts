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
