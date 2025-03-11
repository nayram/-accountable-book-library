import { bookModel } from '@modules/shared/books/infrastructure/book-model';
import { bookFixtures } from '@tests/utils/fixtures/books/book-fixtures';
import { BookStatus } from '@modules/shared/books/domain/book/book-status';

import { BookAlreadyExistsError } from '../domain/book-already-exists-error';
import { BookDoesNotExistsError } from '../domain/book-does-not-exist-error';

import { bookRepository } from '.';
import { referenceIdFixtures } from '@tests/utils/fixtures/references/reference-id-fixtures';
import { referenceFixtures } from '@tests/utils/fixtures/references/reference-fixtures';

describe('bookRepository', () => {
  beforeEach(async () => {
    await bookModel.deleteMany({});
  });

  describe('save', () => {
    it('should create a book if it does not exist', async () => {
      const book = bookFixtures.create();
      await bookRepository.save(book);

      const retrievedBook = await bookModel.findById(book.id).lean();

      expect(retrievedBook).not.toBeNull();

      expect(String(retrievedBook?._id)).toEqual(book.id);
      expect(retrievedBook?.barcode).toEqual(book.barcode);
      expect(retrievedBook?.status).toEqual(book.status);
      expect(String(retrievedBook?.reference_id)).toEqual(book.referenceId);
      expect(retrievedBook?.created_at.toISOString()).toEqual(book.createdAt.toISOString());
      expect(retrievedBook?.updated_at.toISOString()).toEqual(book.updatedAt.toISOString());
    });

    it('should update a book if it already exists', async () => {
      const initialBook = await bookFixtures.insert();

      const updatedBook = bookFixtures.create({
        id: initialBook.id,
        barcode: initialBook.barcode,
        createdAt: initialBook.createdAt,
        status: BookStatus.Borrowed,
      });

      await bookRepository.save(updatedBook);

      const retrievedBook = await bookModel.findById(updatedBook.id).lean();

      expect(retrievedBook).not.toBeNull();

      expect(String(retrievedBook?._id)).toEqual(initialBook.id);
      expect(retrievedBook?.barcode).toEqual(updatedBook.barcode);
      expect(retrievedBook?.status).toEqual(updatedBook.status);
      expect(String(retrievedBook?.reference_id)).toEqual(updatedBook.referenceId);
      expect(retrievedBook?.created_at.toISOString()).toEqual(initialBook.createdAt.toISOString());
      expect(retrievedBook?.updated_at.toISOString()).toEqual(updatedBook.updatedAt.toISOString());
    });
  });

  describe('exists', () => {
    it('should throw error BookAlreadyExistsError', async () => {
      const book = await bookFixtures.insert();

      await expect(bookRepository.exists(book.barcode)).rejects.toThrow(BookAlreadyExistsError);
    });

    it('should resolve successfully if book does not exists', async () => {
      const book = bookFixtures.create();
      await expect(bookRepository.exists(book.barcode)).resolves.toBeUndefined();
    });
  });

  describe('findById', () => {
    it('should throw error BookDoesNotExist', async () => {
      const book = bookFixtures.create();

      await expect(bookRepository.findById(book.id)).rejects.toThrow(BookDoesNotExistsError);
    });

    it('should return book', async () => {
      const book = await bookFixtures.insert();
      const res = await bookRepository.findById(book.id);
      expect(res.id).toBe(book.id);
      expect(res.barcode).toBe(book.barcode);
      expect(res.referenceId).toBe(book.referenceId);
      expect(res.status).toBe(book.status);
      expect(res.createdAt.toISOString()).toBe(book.createdAt.toISOString());
      expect(res.updatedAt.toISOString()).toBe(book.updatedAt.toISOString());
    });
  });

  describe('find', () => {
    it('should return books associated with a referenceId', async () => {
      const referenceId = referenceIdFixtures.create();
      await bookFixtures.insert({ referenceId });
      const books = await bookRepository.find({ referenceId });
      for (const book of books) {
        expect(book.referenceId).toBe(referenceId);
      }
    });
  });
});
