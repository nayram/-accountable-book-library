import { UseCase } from '@modules/shared/core/application/use-case';
import { createPagination } from '@modules/shared/core/domain/pagination';

import { BookRepository } from '../domain/book-repository';
import { PaginatedResults } from '../domain/paginated-results';
import { createSearchParams } from '../domain/search-params';
import { Book } from '../domain/book/book';

export interface FindCatalogsRequest {
  author: string | null;
  publicationYear: number | null;
  title: string | null;
  cursor: string | null;
  limit: number;
}

export type FindCatalogsUseCase = UseCase<FindCatalogsRequest, PaginatedResults<Book>>;

export function findCatalogsBuilder({ bookRepository }: { bookRepository: BookRepository }): FindCatalogsUseCase {
  return async function findCatalogs(req: FindCatalogsRequest) {
    const { cursor, limit, author, publicationYear, title } = req;
    return bookRepository.find(
      createPagination({ limit, cursor }),
      createSearchParams({ author, publicationYear, title }),
    );
  };
}
