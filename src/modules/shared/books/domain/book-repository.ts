import { Book } from './book/book';
import { SearchParams } from './search-params';

export interface BookRepository {
  find(searchParams: SearchParams): Promise<Book[]>;
}
