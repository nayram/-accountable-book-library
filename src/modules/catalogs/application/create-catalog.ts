import { UseCase } from '@modules/shared/core/application/use-case';
import { UuidGenerator } from '@modules/shared/core/domain/uuid-generator';

import { BookRepository } from '../domain/book-repository';
import { Book, create as createBook } from '../domain/book/book';
import { BookAlreadyExistsError } from '../domain/book-already-exists-error';

export interface CreateCatalogRequest {
  title: string;
  author: string;
  publicationYear: number;
  publisher: string;
  price: number;
  quantity: number;
}

export type CreateCatalogUseCase = UseCase<CreateCatalogRequest, Book>;

export function createCatalogBuilder({
  bookRepository,
  uuidGenerator,
}: {
  bookRepository: BookRepository;
  uuidGenerator: UuidGenerator;
}): CreateCatalogUseCase {
  return async function createCatalogUseCase(request: CreateCatalogRequest) {
    const book = createBook({
      ...request,
      id: uuidGenerator.generate(),
    });

    const bookExists = await bookRepository.exits(book);
    console.log(bookExists);
    if (bookExists) {
      throw new BookAlreadyExistsError({ title: book.title, author: book.author, publisher: book.publisher });
    }

    await bookRepository.save(book);
    return book;
  };
}
