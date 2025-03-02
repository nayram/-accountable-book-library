import supertest from 'supertest';
import app from '@api/app';
import { dbSetUp, dbTearDown } from '@tests/utils/mocks/db';
import { bookFixtures } from '@tests/utils/fixtures/catalog/book-fixtures';
import { Book } from '@modules/catalogs/domain/book/book';
import { StatusCodes } from 'http-status-codes';
import { bookIdFixtures } from '@tests/utils/fixtures/catalog/book-id-fixtures';

describe('DELETE /catalogs/:id', () => {
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
      response = await request.delete(path.replace(':id', book.id));
    });

    it('should return 204 status code', () => {
      expect(response.statusCode).toBe(StatusCodes.NO_CONTENT);
    });
  });

  describe('when book does not exist', () => {
    const id = bookIdFixtures.create();
    beforeEach(async () => {
      response = await request.delete(path.replace(':id', id));
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
      response = await request.delete(path.replace(':id', bookIdFixtures.invalidPathId()));
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
