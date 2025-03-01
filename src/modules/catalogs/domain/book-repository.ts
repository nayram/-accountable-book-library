import { Book } from './book/book';

export interface BookRepository {
  save(book: Book): Promise<void>;
  exits(params: { title: string; author: string; publisher: string }): Promise<boolean>;
}
