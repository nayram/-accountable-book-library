import mongoose from 'mongoose';
import { toDTO as toReferenceDTO } from '@modules/shared/references/infrastructure/reference-dto';
import { toDTO as toBookDTO } from '@modules/shared/books/infrastructure/book-dto';
import { BookModel } from '@modules/shared/books/infrastructure/book-model';
import { ReferenceModel } from '@modules/shared/references/infrastructure/reference-model';

import { ReferenceBookTransactionalRepository } from '../domain/reference-book-transactional-repository';

import { ReferenceBookTransactionalModelError } from './reference-book-transactional-model-error';

export function referenceBookTransactionalRepositoryBuilder({
  bookModel,
  referenceModel,
}: {
  referenceModel: ReferenceModel;
  bookModel: BookModel;
}): ReferenceBookTransactionalRepository {
  return {
    async save(reference, books) {
      const session = await mongoose.startSession();
      try {
        await referenceModel.create(toReferenceDTO(reference), { session });
        await bookModel.create(books.map(toBookDTO), { session });
        await session.commitTransaction();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        await session.abortTransaction();
        console.error(error);
        throw new ReferenceBookTransactionalModelError(error.message);
      } finally {
        await session.endSession();
      }
    },
  };
}
