import { Uuid } from '@modules/shared/core/domain/value-objects/uuid';
import { Pagination } from '@modules/shared/core/domain/pagination';

import { Book } from './book/book';
import { SearchParams } from './search-params';
import { PaginatedResults } from './paginated-results';

export interface BookRepository {
  save(book: Book): Promise<void>;
  exits(params: { title: string; author: string; publisher: string }): Promise<boolean>;
  findById(id: Uuid): Promise<Book>;
  deleteById(id: Uuid): Promise<void>;
  find(pagination: Pagination, searchParams: SearchParams): Promise<PaginatedResults<Book>>;
}
