import { Uuid } from '@modules/shared/core/domain/value-objects/uuid';

import { Book } from './book/book';

export interface BookRepository {
  save(book: Book): Promise<void>;
  exits(params: { title: string; author: string; publisher: string }): Promise<boolean>;
  findById(id: Uuid): Promise<Book>;
}
