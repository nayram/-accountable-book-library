import { bookFixtures } from '@tests/utils/fixtures/catalog/book-fixtures';
import { dbDropCollection, dbSetUp, dbTearDown } from '@tests/utils/mocks/db';
import { bookIdFixtures } from '@tests/utils/fixtures/catalog/book-id-fixtures';

import { BookDoesNotExistsError } from '../domain/book-does-not-exist-error';

import { bookModel } from './book-model';

import { bookRepository } from '.';

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
      expect(result?.reference_id).toBe(book.referenceId);
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
      expect(result?.reference_id).toBe(updatedBook.referenceId);
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
    it('should throw error if book does not exist', async () => {
      const id = bookIdFixtures.create();
      await expect(bookRepository.findById(id)).rejects.toThrow(BookDoesNotExistsError);
    });

    it('should return book if it exists', async () => {
      const book = bookFixtures.create();
      await bookRepository.save(book);
      expect(bookRepository.findById(book.id)).resolves.toEqual(book);
    });
  });

  describe('deleteById', () => {
    it('should throw error if book does not exist', () => {
      const id = bookIdFixtures.create();
      expect(bookRepository.deleteById(id)).rejects.toThrow(BookDoesNotExistsError);
    });

    it('should delete book successfully', async () => {
      const book = await bookFixtures.insert();
      await bookRepository.deleteById(book.id);
      const res = await bookModel.findById(book.id);

      expect(res).toBeNull();
    });
  });

  describe('find', () => {
    beforeEach(async () => {
      await dbDropCollection('books');
    });
    it('should return paginated books with next cursor', async () => {
      const books = bookFixtures.createMany({ length: 3 });
      for (const book of books) {
        await bookRepository.save(book);
      }

      const pagination = { limit: 2, cursor: null };
      const searchParams = {};

      const result = await bookRepository.find(pagination, searchParams);

      expect(result.data.length).toBe(2);
      expect(result.totalCount).toBe(3);
      expect(result.cursor).not.toBeNull();
    });

    it('should return paginated books with cursor as null if no search values where provided', async () => {
      const books = bookFixtures.createMany({ length: 2 });
      for (const book of books) {
        await bookRepository.save(book);
      }

      const pagination = { limit: 2, cursor: null };
      const searchParams = {};

      const result = await bookRepository.find(pagination, searchParams);

      expect(result.data.length).toBe(2);
      expect(result.totalCount).toBe(2);
      expect(result.cursor).toEqual(books[books.length - 1].id);
    });

    it('should return books matching search parameters', async () => {
      const book1 = bookFixtures.create();
      const book2 = bookFixtures.create();
      await bookRepository.save(book1);
      await bookRepository.save(book2);

      const pagination = { limit: 2, cursor: null };
      const searchParams = { title: book1.title };

      const result = await bookRepository.find(pagination, searchParams);

      expect(result.data.length).toBe(1);
      expect(result.totalCount).toBe(1);
      expect(result.data[0].title).toBe(book1.title);
    });
  });
});
