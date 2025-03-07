import { UseCase } from '@modules/shared/core/application/use-case';
import { UuidGenerator } from '@modules/shared/core/domain/uuid-generator';
import { BookStatus } from '@modules/shared/books/domain/book/book-status';
import { Book, create } from '@modules/shared/books/domain/book/book';

import { BookRepository } from '../domain/book-repository';

export interface CreateBookRequest {
  barcode: string;
  referenceId: string;
  status: BookStatus;
}

export type CreateBookUseCase = UseCase<CreateBookRequest, Book>;

export function createBookBuilder({
  bookRepository,
  uuidGenerator,
}: {
  bookRepository: BookRepository;
  uuidGenerator: UuidGenerator;
}): CreateBookUseCase {
  return async function createBook(request: CreateBookRequest) {
    const id = uuidGenerator.generate();
    const book = create({ ...request, id });

    await bookRepository.exists(book.barcode);

    await bookRepository.save(book);

    return book;
  };
}
