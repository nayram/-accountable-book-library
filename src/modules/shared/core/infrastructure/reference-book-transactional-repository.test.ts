import { bookModel } from '@modules/shared/books/infrastructure/book-model';
import { referenceModel } from '@modules/shared/references/infrastructure/reference-model';
import { bookFixtures } from '@tests/utils/fixtures/books/book-fixtures';
import { referenceFixtures } from '@tests/utils/fixtures/references/reference-fixtures';
import { dbSetUp, dbTearDown } from '@tests/utils/mocks/db';

import { ReferenceBookTransactionalModelError } from './reference-book-transactional-model-error';

import { referenceBookTransactionalRepository } from '.';

describe('ReferenceBookTransactionalRepository', () => {
  beforeAll(async () => {
    await dbSetUp();
  });

  beforeEach(async () => {
    await bookModel.deleteMany({});
    await referenceModel.deleteMany({});
  });

  afterAll(async () => {
    await dbTearDown();
  });

  describe('save', () => {
    const reference = referenceFixtures.create();
    const books = bookFixtures.createMany({ book: { referenceId: reference.id }, length: 3 });

    it('should successfully save a reference and its related books in a transaction', async () => {
      await referenceBookTransactionalRepository.save(reference, books);

      const savedReference = await referenceModel.findOne({ _id: reference.id });
      const savedBooks = await bookModel.find({ reference_id: reference.id }).sort();

      expect(savedReference).not.toBeNull();
      expect(savedReference?._id).toBe(reference.id);
      expect(savedReference?.external_reference_id).toBe(reference.externalReferenceId);
      expect(savedReference?.title).toBe(reference.title);
      expect(savedReference?.author).toBe(reference.author);
      expect(savedReference?.publication_year).toBe(reference.publicationYear);
      expect(savedReference?.price).toBe(reference.price);
      expect(savedReference?.soft_delete).toEqual(reference.softDelete);
      expect(savedReference?.created_at.toISOString()).toEqual(reference.createdAt.toISOString());
      expect(savedReference?.updated_at.toISOString()).toEqual(reference.updatedAt.toISOString());

      expect(savedBooks.length).toBe(books.length);

      savedBooks.sort((a, b) => a.created_at.getTime() - b.created_at.getTime());
      books.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      for (let i = 0; i < savedBooks.length; i++) {
        const savedBook = savedBooks.find((b) => String(b._id) === books[i].id);
        expect(savedBook).not.toBeNull();
        expect(savedBook?.reference_id).toBe(reference.id);
      }
    });

    it('should rollback the transaction if saving the reference fails', async () => {
      jest.spyOn(referenceModel, 'create').mockImplementationOnce(() => {
        throw new Error('Simulated reference creation error');
      });

      await expect(referenceBookTransactionalRepository.save(reference, books)).rejects.toThrow(
        ReferenceBookTransactionalModelError,
      );

      const savedReference = await referenceModel.findOne({ _id: reference.id });
      const savedBooks = await bookModel.find({ reference_id: reference.id });

      expect(savedReference).toBeNull();
      expect(savedBooks.length).toBe(0);
    });
  });
});
