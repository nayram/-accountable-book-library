import { Book } from '@modules/shared/books/domain/book/book';
import { Reference } from '@modules/shared/references/domain/reference';

export interface ReferenceBookRepository {
  save(reference: Reference, books: Book[]): Promise<void>;
}
