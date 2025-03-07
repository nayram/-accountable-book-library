import app from '@api/app';
import { Book } from '@modules/shared/books/domain/book/book';
import { bookFixtures } from '@tests/utils/fixtures/books/book-fixtures';
import { bookIdFixtures } from '@tests/utils/fixtures/books/book-id-fixtures';
import { referenceFixtures } from '@tests/utils/fixtures/references/reference-fixtures';
import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';

describe('GET /books/:id/status', () => {
  const request = supertest.agent(app);
  const path = '/api/books/:id/status';
  let response: supertest.Response;

  describe('when book exists', () => {
    let book: Book;
    beforeEach(async () => {
      const reference = await referenceFixtures.insert();
      book = await bookFixtures.insert({ referenceId: reference.id });

      response = await request.get(path.replace(':id', book.id));
    });

    it('should return 200 status code', () => {
      expect(response.statusCode).toBe(StatusCodes.OK);
    });

    it('should return valid reference', () => {
      expect(response.body).toEqual({ status: book.status });
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
        message: `book with id ${id} does not exist`,
      });
    });
  });

  describe('when invalid id is provided', () => {
    const id = bookIdFixtures.invalid();
    beforeEach(async () => {
      response = await request.get(path.replace(':id', id));
    });

    it('should return 400 status code', () => {
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should return error message', () => {
      expect(response.body).toEqual({
        status: 'Bad Request',
        statusCode: StatusCodes.BAD_REQUEST,
        message: `book id must be a uuid v4`,
      });
    });
  });
});
