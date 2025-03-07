import app from '@api/app';
import supertest from 'supertest';
import { referenceIdFixtures } from '@tests/utils/fixtures/references/reference-id-fixtures';
import { barcodeFixtures } from '@tests/utils/fixtures/books/bar-code-fixtures';
import { bookStatusFixtures } from '@tests/utils/fixtures/books/book-status-fixtures';
import { StatusCodes } from 'http-status-codes';

import { PostCreateBookRequest } from './post-create-book-request';
import { dropAllCollections } from '@tests/utils/mocks/db';
import { Book } from '@modules/shared/books/domain/book/book';
import { bookFixtures } from '@tests/utils/fixtures/books/book-fixtures';
import { Barcode } from '@modules/shared/books/domain/book/bar-code';
import { Reference } from '@modules/shared/references/domain/reference';
import { referenceFixtures } from '@tests/utils/fixtures/references/reference-fixtures';

describe('POST /books', () => {
  const request = supertest.agent(app);
  const path = '/api/books';

  afterEach(async () => {
    await dropAllCollections();
  });

  describe('when a valid body is sent', () => {
    let requestBody: PostCreateBookRequest['body'];
    let response: supertest.Response;
    let existingBarCode = barcodeFixtures.create();
    let reference: Reference;

    beforeEach(async () => {
      await bookFixtures.insert({ barcode: existingBarCode });
      reference = await referenceFixtures.insert();
    });

    describe('and reference does not exists', () => {
      const referenceId = referenceIdFixtures.create();
      beforeEach(async () => {
        requestBody = {
          referenceId,
          barcode: barcodeFixtures.create(),
          status: bookStatusFixtures.create(),
        };
        response = await request.post(path).send(requestBody);
      });

      it('should return 404 status', () => {
        expect(response.status).toBe(StatusCodes.NOT_FOUND);
      });

      it('should return an error message', () => {
        expect(response.body).toEqual({
          status: 'Not Found',
          statusCode: StatusCodes.NOT_FOUND,
          message: `reference with id ${referenceId} does not exist`,
        });
      });
    });

    describe('with book with an existing barcode', () => {
      beforeEach(async () => {
        requestBody = {
          barcode: existingBarCode,
          referenceId: reference.id,
          status: bookStatusFixtures.create(),
        };

        response = await request.post(path).send(requestBody);
      });

      it('should return a 400 status', () => {
        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      });

      it('should return an error message', () => {
        expect(response.body).toEqual({
          status: 'Bad Request',
          statusCode: StatusCodes.BAD_REQUEST,
          message: `book with barcode ${existingBarCode} already exists`,
        });
      });
    });

    describe('and book is created successfully', () => {
      beforeEach(async () => {
        requestBody = {
          barcode: barcodeFixtures.create(),
          status: bookStatusFixtures.create(),
          referenceId: reference.id,
        };

        response = await request.post(path).send(requestBody);
      });

      it('should return a 201 status', () => {
        expect(response.status).toBe(StatusCodes.CREATED);
      });
      it('should return created book', () => {
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('barcode', requestBody.barcode);
        expect(response.body).toHaveProperty('status', requestBody.status);
        expect(response.body).toHaveProperty('referenceId', requestBody.referenceId);
        expect(response.body).toHaveProperty('createdAt');
        expect(response.body).toHaveProperty('updatedAt');
      });
    });
  });

  describe('when an invalid body is sent', () => {
    let requestBody: PostCreateBookRequest['body'];
    let response: supertest.Response;

    beforeEach(async () => {
      requestBody = {
        referenceId: referenceIdFixtures.invalid(),
        barcode: barcodeFixtures.create(),
        status: bookStatusFixtures.create(),
      };
      response = await request.post(path).send(requestBody);
    });

    it('should return a 400 status', () => {
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should return an error message', () => {
      expect(response.body).toEqual({
        status: expect.any(String),
        statusCode: StatusCodes.BAD_REQUEST,
        message: expect.any(String),
      });
    });
  });
});
