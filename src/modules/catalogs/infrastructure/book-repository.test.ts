import { bookFixtures } from '@tests/utils/fixtures/catalog/book-fixtures';
import { dbSetUp, dbTearDown } from '@tests/utils/mocks/db';

import { bookModel } from './book-model';

import { bookRepository } from '.';
import { bookIdFixtures } from '@tests/utils/fixtures/catalog/book-id-fixtures';
import { BookDoesNotExistsError } from '../domain/book-does-not-exist-error';

describe('BookRepository', () => {
  beforeAll(async () => {
    await dbSetUp();
  });

  afterAll(async () => {
    await dbTearDown();
  });

  describe('save', () => {
    it('should create a book', async () => {
      const book = bookFixtures.create();
      await bookRepository.save(book);
      const result = await bookModel.findById(book.id);
      expect(result).not.toBeNull();
      expect(result?._id).toBe(book.id);
      expect(result?.title).toBe(book.title);
      expect(result?.author).toBe(book.author);
      expect(result?.publication_year).toBe(book.publicationYear);
      expect(result?.quantity).toBe(book.quantity);
      expect(result?.price).toBe(book.price);
      expect(result?.created_at.toISOString()).toBe(book.createdAt.toISOString());
      expect(result?.updated_at.toISOString()).toBe(book.updatedAt.toISOString());
    });

    it('should update a book', async () => {
      const book = bookFixtures.create();
      await bookRepository.save(book);
      const updatedBook = bookFixtures.create({ id: book.id });
      await bookRepository.save(updatedBook);

      const result = await bookModel.findById(updatedBook.id);

      expect(result).not.toBeNull();
      expect(result?._id).toBe(updatedBook.id);
      expect(result?.title).toBe(updatedBook.title);
      expect(result?.author).toBe(updatedBook.author);
      expect(result?.publication_year).toBe(updatedBook.publicationYear);
      expect(result?.quantity).toBe(updatedBook.quantity);
      expect(result?.price).toBe(updatedBook.price);
      expect(result?.created_at.toISOString()).toBe(book.createdAt.toISOString());
      expect(result?.updated_at.toISOString()).toBe(updatedBook.updatedAt.toISOString());
    });
  });

  describe('exists', () => {
    it('should return true if book is already exists', async () => {
      const book = bookFixtures.create();
      await bookRepository.save(book);
      const duplicatedBook = bookFixtures.create({ title: book.title, author: book.author, publisher: book.publisher });
      await expect(bookRepository.exits(duplicatedBook)).resolves.toBe(true);
    });

    it('should return false if book does not exist', async () => {
      const book = bookFixtures.create();
      await expect(bookRepository.exits(book)).resolves.toBe(false);
    });
  });

  describe('findById', () => {
    it('should thow error if book does not exist', async () => {
      const id = bookIdFixtures.create();
      await expect(bookRepository.findById(id)).rejects.toThrow(BookDoesNotExistsError);
    });

    it('should return book if it exists', async () => {
      const book = bookFixtures.create();
      await bookRepository.save(book);
      await expect(bookRepository.findById(book.id)).resolves.toEqual(book);
    });
  });
});
