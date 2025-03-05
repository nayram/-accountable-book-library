import { toDTO as toReferenceDTO } from '@modules/shared/references/infrastructure/reference-dto';
import { toDTO as toBookDTO } from '@modules/shared/books/infrastructure/book-dto';
import { BookModel } from '@modules/shared/books/infrastructure/book-model';
import { ReferenceModel } from '@modules/shared/references/infrastructure/reference-model';

import { ReferenceBookRepository } from '../domain/reference-book-repository';

import { ReferenceBookModelError } from './reference-book-model-error';

export function referenceBookRepositoryBuilder({
  bookModel,
  referenceModel,
}: {
  referenceModel: ReferenceModel;
  bookModel: BookModel;
}): ReferenceBookRepository {
  return {
    async save(reference, books) {
      try {
        await referenceModel.create(toReferenceDTO(reference));
        await bookModel.create(books.map(toBookDTO));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        try {
          await referenceModel.deleteOne({ _id: reference.id });
          await bookModel.deleteMany({ reference_id: reference.id });
        } catch (cleanupError) {
          console.error('Failed to clean up after error:', cleanupError);
        }

        throw new ReferenceBookModelError(`Failed to save reference and books: ${error.message}`);
      }
    },
  };
}
