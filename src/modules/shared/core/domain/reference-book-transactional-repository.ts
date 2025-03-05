import { Book } from '@modules/shared/books/domain/book';
import { Reference } from '@modules/shared/references/domain/reference';

export interface ReferenceBookTransactionalRepository {
  save(reference: Reference, books: Book[]): Promise<void>;
}
