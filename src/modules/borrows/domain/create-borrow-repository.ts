import { Book } from '@modules/shared/books/domain/book/book';

import { Borrow } from './borrow/borrow';

export interface CreateBorrowRepository {
  save(book: Book, borrow: Borrow): Promise<void>;
}
