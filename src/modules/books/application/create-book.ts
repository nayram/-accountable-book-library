import { UseCase } from '@modules/shared/core/application/use-case';
import { UuidGenerator } from '@modules/shared/core/domain/uuid-generator';
import { Book, create } from '@modules/shared/books/domain/book/book';
import { ReferenceRepository } from '@modules/shared/references/domain/reference-repository';

import { BookRepository } from '../domain/book-repository';

export interface CreateBookRequest {
  barcode: string;
  referenceId: string;
  status: string;
}

export type CreateBookUseCase = UseCase<CreateBookRequest, Book>;

export function createBookBuilder({
  bookRepository,
  referenceRepository,
  uuidGenerator,
}: {
  bookRepository: BookRepository;
  referenceRepository: ReferenceRepository;
  uuidGenerator: UuidGenerator;
}): CreateBookUseCase {
  return async function createBook(request: CreateBookRequest) {
    const id = uuidGenerator.generate();
    const book = create({ ...request, id });

    await referenceRepository.exists(book.referenceId);

    await bookRepository.exists(book.barcode);

    await bookRepository.save(book);

    return book;
  };
}
