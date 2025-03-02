import { UseCase } from '@modules/shared/core/application/use-case';

import { Book } from '../domain/book/book';
import { BookRepository } from '../domain/book-repository';
import { createBookId } from '../domain/book/book-id';

export interface FindCatalogByBookIdRequest {
  id: string;
}

export type FindCatalogByBookIdUseCase = UseCase<FindCatalogByBookIdRequest, Book>;

export function findCatalogByBookIdBuilder({
  bookRepository,
}: {
  bookRepository: BookRepository;
}): FindCatalogByBookIdUseCase {
  return async function findCatalogByBookId({ id }: FindCatalogByBookIdRequest) {
    return bookRepository.findById(createBookId(id));
  };
}
