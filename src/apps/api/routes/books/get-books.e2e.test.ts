import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';

import app from '@api/app';
import { Book } from '@modules/shared/books/domain/book/book';
import { bookFixtures } from '@tests/utils/fixtures/books/book-fixtures';
import { referenceFixtures } from '@tests/utils/fixtures/references/reference-fixtures';
import { Reference } from '@modules/shared/references/domain/reference';
import { referenceIdFixtures } from '@tests/utils/fixtures/references/reference-id-fixtures';

describe('GET /references/:id/book', () => {
  const request = supertest.agent(app);
  const path = '/api/references/:id/books';
  let response: supertest.Response;

  describe('when valid request is made', () => {
    let reference: Reference;

    beforeEach(async () => {
      reference = await referenceFixtures.insert();
      await bookFixtures.insertMany({ book: { referenceId: reference.id } });

      response = await request.get(path.replace(':id', reference.id));
    });

    it('should return 200 status code', () => {
      expect(response.statusCode).toBe(StatusCodes.OK);
    });

    it('should return valid reference', () => {
      const { body } = response;
      for (const book of body) {
        expect(book.referenceId).toEqual(reference.id);
      }
    });
  });

  describe('when invalid id is provided', () => {
    const referenceId = referenceIdFixtures.invalid();
    beforeEach(async () => {
      response = await request.get(path.replace(':id', referenceId));
    });

    it('should return 400 status code', () => {
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should return error message', () => {
      expect(response.body).toEqual({
        status: 'Bad Request',
        statusCode: StatusCodes.BAD_REQUEST,
        message: expect.any(String),
      });
    });
  });
});
