import supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';
import app from '@api/app';
import { bookIdFixtures } from '@tests/utils/fixtures/catalog/book-id-fixtures';
import { dbSetUp, dbTearDown } from '@tests/utils/mocks/db';
import { bookFixtures } from '@tests/utils/fixtures/catalog/book-fixtures';
import { Book } from '@modules/catalogs/domain/book/book';

describe('GET /catalogs/:id', () => {
  const request = supertest.agent(app);
  const path = '/api/catalogs/:id';
  let response: supertest.Response;

  beforeAll(async () => {
    await dbSetUp();
  });

  afterAll(async () => {
    await dbTearDown();
  });

  describe('when book exists', () => {
    let book: Book;
    beforeEach(async () => {
      book = await bookFixtures.insert();

      response = await request.get(path.replace(':id', book.id));
    });

    it('should return 200 status code', () => {
      expect(response.statusCode).toBe(StatusCodes.OK);
    });

    it('should return valid book', () => {
      expect(response.body).toEqual({
        ...book,
        createdAt: book.createdAt.toISOString(),
        updatedAt: book.updatedAt.toISOString(),
      });
    });
  });

  describe('when book does not exist', () => {
    const id = bookIdFixtures.create();
    beforeEach(async () => {
      response = await request.get(path.replace(':id', id));
    });

    it('should return 404 status code', () => {
      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
    });

    it('should return error message', () => {
      expect(response.body).toEqual({
        status: 'Not Found',
        statusCode: StatusCodes.NOT_FOUND,
        message: `Book with id ${id} does not exists`,
      });
    });
  });

  describe('when invalid id is provided', () => {
    beforeEach(async () => {
      response = await request.get(path.replace(':id', bookIdFixtures.invalidPathId()));
    });

    it('should return 400 status code', () => {
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should return error message', () => {
      expect(response.body).toEqual({
        status: 'Bad Request',
        statusCode: StatusCodes.BAD_REQUEST,
        message: `bookId must be a uuid v4`,
      });
    });
  });
});
