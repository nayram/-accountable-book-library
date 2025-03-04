import supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';

import app from '@api/app';
import { dbSetUp, dbTearDown } from '@tests/utils/mocks/db';
import { titleFixtures } from '@tests/utils/fixtures/references/title-fixtures';
import { authorFixtures } from '@tests/utils/fixtures/references/author-fixtures';
import { publicationYearFixtures } from '@tests/utils/fixtures/references/publication-year-fixtures';
import { publisherFixtures } from '@tests/utils/fixtures/references/publisher-fixtures';
import { priceFixtures } from '@tests/utils/fixtures/references/price-fixtures';
import { externalReferenceIdFixtures } from '@tests/utils/fixtures/references/external-reference-id-fixtures';
import { Reference } from '@modules/references/domain/reference/reference';
import { referenceFixtures } from '@tests/utils/fixtures/references/reference-fixtures';

import { PostCreateReferenceRequest } from './post-create-reference-request';

describe('POST /api/references', () => {
  const request = supertest.agent(app);
  const path = '/api/references';

  beforeAll(async () => {
    await dbSetUp();
  });

  afterAll(async () => {
    await dbTearDown();
  });

  describe('when a valid body is sent', () => {
    let requestBody: PostCreateReferenceRequest['body'];
    let response: supertest.Response;

    describe('when reference does not exist', () => {
      beforeEach(async () => {
        requestBody = {
          referenceId: externalReferenceIdFixtures.create(),
          title: titleFixtures.create(),
          author: authorFixtures.create(),
          publicationYear: publicationYearFixtures.create(),
          publisher: publisherFixtures.create(),
          price: priceFixtures.create(),
        };

        response = await request.post(path).send(requestBody);
      });

      it('should return a 201 status', () => {
        expect(response.status).toBe(StatusCodes.CREATED);
      });

      it('should return the created reference', () => {
        expect(response.body).toEqual({
          id: expect.any(String),
          referenceId: requestBody.referenceId,
          title: requestBody.title,
          author: requestBody.author,
          publicationYear: requestBody.publicationYear,
          publisher: requestBody.publisher,
          price: requestBody.price,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
      });
    });

    describe('when reference already exists', () => {
      let existingReference: Reference;
      beforeEach(async () => {
        existingReference = await referenceFixtures.insert();

        requestBody = {
          referenceId: existingReference.externalReferenceId,
          title: titleFixtures.create(),
          author: authorFixtures.create(),
          publisher: publisherFixtures.create(),
          publicationYear: publicationYearFixtures.create(),
          price: priceFixtures.create(),
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
          message: `Reference with id, ${existingReference.externalReferenceId} already exists`,
        });
      });
    });
  });

  describe('when an invalid body is sent', () => {
    let response: supertest.Response;

    beforeEach(async () => {
      const requestBody = {
        title: titleFixtures.invalid(),
        referenceId: externalReferenceIdFixtures.invalid(),
        author: authorFixtures.create(),
        publicationYear: publicationYearFixtures.create(),
        publisher: publisherFixtures.create(),
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
