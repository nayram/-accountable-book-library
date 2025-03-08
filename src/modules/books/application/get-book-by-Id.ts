import { UseCase } from '@modules/shared/core/application/use-case';
import { createBookId } from '@modules/shared/books/domain/book/book-id';
import { Book } from '@modules/shared/books/domain/book/book';

import { BookRepository } from '../domain/book-repository';

export interface GetBookByIdRequest {
  id: string;
}

export type GetBookByIdUseCase = UseCase<GetBookByIdRequest, Book>;

export function getBookByIdBuilder({ bookRepository }: { bookRepository: BookRepository }): GetBookBookUseCase {
  return async function getBookById(req: GetBookByIdRequest) {
    return await bookRepository.findById(createBookId(req.id));
  };
}
