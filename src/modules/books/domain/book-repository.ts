import { Barcode } from '@modules/shared/books/domain/book/bar-code';
import { Book } from '@modules/shared/books/domain/book/book';

export interface BookRepository {
  save(book: Book): Promise<void>;
  exists(barcode: Barcode): Promise<void>;
}
