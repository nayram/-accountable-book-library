import supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';

import app from '@api/app';
import { dbSetUp, dbTearDown } from '@tests/utils/mocks/db';
import { titleFixtures } from '@tests/utils/fixtures/catalog/title-fixtures';
import { authorFixtures } from '@tests/utils/fixtures/catalog/author-fixtures';
import { publicationYearFixtures } from '@tests/utils/fixtures/catalog/publication-year-fixtures';
import { publisherFixtures } from '@tests/utils/fixtures/catalog/publisher-fixtures';
import { quantityFixtures } from '@tests/utils/fixtures/catalog/quantity-fixtures';
import { priceFixtures } from '@tests/utils/fixtures/catalog/price-fixtures';
import { bookFixtures } from '@tests/utils/fixtures/catalog/book-fixtures';
import { Book } from '@modules/catalogs/domain/book/book';

import { PostCreateCatalogRequest } from './post-create-catalog-request';

describe('POST /api/catalogs', () => {
  const request = supertest.agent(app);
  const path = '/api/catalogs';

  beforeAll(async () => {
    await dbSetUp();
  });

  afterAll(async () => {
    await dbTearDown();
  });

  describe('when a valid body is sent', () => {
    let requestBody: PostCreateCatalogRequest['body'];
    let response: supertest.Response;

    describe('when book does not exist', () => {
      beforeEach(async () => {
        requestBody = {
          title: titleFixtures.create(),
          author: authorFixtures.create(),
          publicationYear: publicationYearFixtures.create(),
          publisher: publisherFixtures.create(),
          quantity: quantityFixtures.create(),
          price: priceFixtures.create(),
        };

        response = await request.post(path).send(requestBody);
      });

      it('should return a 201 status', () => {
        expect(response.status).toBe(StatusCodes.CREATED);
      });

      it('should return the created catalog', () => {
        expect(response.body).toEqual({
          id: expect.any(String),
          title: requestBody.title,
          author: requestBody.author,
          publicationYear: requestBody.publicationYear,
          publisher: requestBody.publisher,
          quantity: requestBody.quantity,
          price: requestBody.price,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
      });
    });

    describe('when book already exists', () => {
      let existingBook: Book;
      beforeEach(async () => {
        existingBook = await bookFixtures.insert();

        requestBody = {
          title: existingBook.title,
          author: existingBook.author,
          publisher: existingBook.publisher,
          publicationYear: publicationYearFixtures.create(),
          quantity: quantityFixtures.create(),
          price: quantityFixtures.create(),
        };

        response = await request.post(path).send(requestBody);
      });

      it('should return a 401 status', () => {
        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      });

      it('should return an error response', () => {
        expect(response.body).toEqual({
          status: 'Bad Request',
          statusCode: StatusCodes.BAD_REQUEST,
          // eslint-disable-next-line max-len
          message: `Book with title ${existingBook.title}, author ${existingBook.author} and publisher ${existingBook.publisher} already exists`,
        });
      });
    });
  });

  describe('when an invalid body is sent', () => {
    let response: supertest.Response;

    beforeEach(async () => {
      const requestBody = {
        title: titleFixtures.invalid(),
        author: authorFixtures.create(),
        publicationYear: publicationYearFixtures.create(),
        publisher: publisherFixtures.create(),
        quantity: quantityFixtures.create(),
        price: priceFixtures.create(),
      };
      response = await request.post(path).send(requestBody);
    });

    it('should return a 400 status', () => {
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should return an error response', () => {
      expect(response.body).toEqual({
        status: expect.any(String),
        statusCode: StatusCodes.BAD_REQUEST,
        message: expect.any(String),
      });
    });
  });
});
