import { UseCase } from '@modules/shared/core/application/use-case';
import { Book } from '@modules/shared/books/domain/book/book';
import { createReferenceId } from '@modules/shared/references/domain/reference-id';

import { BookRepository } from '../domain/book-repository';

export interface FindBooksRequest {
  referenceId: string;
}

export type FindBooksUseCase = UseCase<FindBooksRequest, Book[]>;

export function findBooksBuilder({ bookRepository }: { bookRepository: BookRepository }): FindBooksUseCase {
  return async function findBooks(req: FindBooksRequest) {
    return await bookRepository.find({ referenceId: createReferenceId(req.referenceId) });
  };
}
