import { dbSetUp, dbTearDown } from '@tests/utils/mocks/db';
import { referenceIdFixtures } from '@tests/utils/fixtures/references/reference-id-fixtures';
import { bookFixtures } from '@tests/utils/fixtures/books/book-fixtures';

import { bookModel } from './book-model';
import { toDTO } from './book-dto';

import { bookRepository } from '.';

describe('bookRepository', () => {
  beforeAll(async () => {
    await dbSetUp();
  });

  afterAll(async () => {
    await dbTearDown();
  });

  beforeEach(async () => {
    await bookModel.deleteMany({});
  });

  describe('find', () => {
    it('should find books with matching reference id', async () => {
      const referenceId = referenceIdFixtures.create();
      const books = bookFixtures.createMany({ book: { referenceId } });
      await bookModel.create(books.map(toDTO));
      const result = await bookRepository.find({ referenceId });
      expect(result.length).toEqual(books.length);
      for (const record of result) {
        expect(record.referenceId).toBe(referenceId);
      }
    });

    it('should return an empty array if there are matching reference id', async () => {
      const referenceId = referenceIdFixtures.create();
      const books = bookFixtures.createMany({});
      await bookModel.create(books.map(toDTO));
      const result = await bookRepository.find({ referenceId });
      expect(result.length).toBe(0);
    });
  });
});
