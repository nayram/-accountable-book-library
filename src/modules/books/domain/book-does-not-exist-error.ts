import { BookId } from '@modules/shared/books/domain/book/book-id';

export class BookDoesNotExistsError extends Error {
  constructor(id: BookId) {
    super(`book with id ${id} does not exist`);
    this.name = 'BookDoesNotExistsError';
  }
}
