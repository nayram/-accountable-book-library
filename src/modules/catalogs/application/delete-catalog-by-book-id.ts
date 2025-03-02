import { UseCase } from '@modules/shared/core/application/use-case';

import { BookRepository } from '../domain/book-repository';
import { createBookId } from '../domain/book/book-id';

export interface DeleteCatalogByBookIdRequest {
  id: string;
}

export type DeleteCatalogByBookIdUseCase = UseCase<DeleteCatalogByBookIdRequest, void>;

export function deleteCatalogByBookIdBuilder({
  bookRepository,
}: {
  bookRepository: BookRepository;
}): DeleteCatalogByBookIdUseCase {
  return async function deleteCatalogByBookId({ id }: DeleteCatalogByBookIdRequest) {
    await bookRepository.deleteById(createBookId(id));
  };
}
