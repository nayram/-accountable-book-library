import { BookStatus } from '@modules/shared/books/domain/book/book-status';
import { UseCase } from '@modules/shared/core/application/use-case';
import { createBookId } from '@modules/shared/books/domain/book/book-id';

import { BookRepository } from '../domain/book-repository';

export interface GetBookStatusRequest {
  id: string;
}

export type GetBookStatusUseCase = UseCase<GetBookStatusRequest, { status: BookStatus }>;

export function getBookStatusBuilder({ bookRepository }: { bookRepository: BookRepository }): GetBookStatusUseCase {
  return async function getBookStatus(req: GetBookStatusRequest) {
    const { status } = await bookRepository.findById(createBookId(req.id));
    return { status };
  };
}
