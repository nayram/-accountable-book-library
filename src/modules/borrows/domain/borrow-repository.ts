import { Borrow } from './borrow/borrow';
import { SearchParams } from './search-params';

export interface BorrowRepository {
  find(searchParams: SearchParams): Promise<Borrow[]>;
}
