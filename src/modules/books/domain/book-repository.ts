import { Barcode } from '@modules/shared/books/domain/book/bar-code';
import { Book } from '@modules/shared/books/domain/book/book';
import { BookId } from '@modules/shared/books/domain/book/book-id';

export interface BookRepository {
  save(book: Book): Promise<void>;
  exists(barcode: Barcode): Promise<void>;
  findById(id: BookId): Promise<Book>;
}
