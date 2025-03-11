import { Barcode } from '@modules/shared/books/domain/book/bar-code';
import { Book } from '@modules/shared/books/domain/book/book';
import { BookId } from '@modules/shared/books/domain/book/book-id';
import { ReferenceId } from '@modules/shared/references/domain/reference-id';

export interface BookRepository {
  save(book: Book): Promise<void>;
  exists(barcode: Barcode): Promise<void>;
  findById(id: BookId): Promise<Book>;
  find(params: { referenceId: ReferenceId }): Promise<Book[]>;
}
