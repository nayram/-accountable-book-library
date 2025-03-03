import supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';

import app from '@api/app';
import { dbSetUp, dbTearDown } from '@tests/utils/mocks/db';
import { bookFixtures } from '@tests/utils/fixtures/catalog/book-fixtures';
import { authorFixtures } from '@tests/utils/fixtures/catalog/author-fixtures';
import { titleFixtures } from '@tests/utils/fixtures/catalog/title-fixtures';
import { publicationYearFixtures } from '@tests/utils/fixtures/catalog/publication-year-fixtures';

describe('GET /catalogs/search', () => {
  const request = supertest.agent(app);
  let response: supertest.Response;
  const path = '/api/catalogs/search';

  const author = authorFixtures.create();
  const title = titleFixtures.create();
  const publicationYear = 1900;
  const numberOfRecords = 5;
  const limit = 2;

  beforeAll(async () => {
    await dbSetUp();
  });

  afterAll(async () => {
    await dbTearDown();
  });

  describe('when valid request is made', () => {
    beforeAll(async () => {
      await bookFixtures.insertMany({ book: { author }, length: numberOfRecords });
      await bookFixtures.insertMany({ book: { title }, length: numberOfRecords });
      await bookFixtures.insertMany({ book: { publicationYear }, length: numberOfRecords });
    });

    describe('author', () => {
      beforeEach(async () => {
        response = await request.get(path).query({ author, limit });
      });

      it('should return status code 200', async () => {
        expect(response.status).toBe(StatusCodes.OK);
      });

      it(`should return ${limit} records`, () => {
        expect(response.body.data).toHaveLength(limit);
      });

      it('should return the total count of records', () => {
        expect(response.body.totalCount).toBe(numberOfRecords);
      });

      it('should return cursor', () => {
        expect(response.body.cursor).not.toBeNull();
      });

      it('should return books with the same author', () => {
        const { data } = response.body;
        for (const record of data) {
          expect(record.author).toEqual(author);
        }
      });

      it('should fetch next set of records using cursor', async () => {
        const {
          body: { data },
        } = await request.get(path).query({ author, cursor: response.body.cursor, limit });
        expect(data).not.toEqual(response.body.data);
        for (const record of data) {
          expect(record.author).toEqual(author);
        }
      });
    });

    describe('title', () => {
      beforeEach(async () => {
        response = await request.get(path).query({ title, limit });
      });

      it('should return status code 200', async () => {
        expect(response.status).toBe(StatusCodes.OK);
      });

      it(`should return ${limit} records`, () => {
        expect(response.body.data).toHaveLength(limit);
      });

      it('should return the total count of records', () => {
        expect(response.body.totalCount).toBe(numberOfRecords);
      });

      it('should return cursor', () => {
        expect(response.body.cursor).not.toBeNull();
      });

      it('should return books with the same title', () => {
        const { data } = response.body;
        for (const record of data) {
          expect(record.title).toEqual(title);
        }
      });

      it('should fetch next set of records using cursor', async () => {
        const {
          body: { data },
        } = await request.get(path).query({ author, cursor: response.body.cursor, limit });
        expect(data).not.toEqual(response.body.data);
        for (const record of data) {
          expect(record.author).toEqual(author);
        }
      });
    });

    describe('publicationYear', () => {
      beforeEach(async () => {
        response = await request.get(path).query({ publicationYear, limit });
      });

      it('should return status code 200', async () => {
        expect(response.status).toBe(StatusCodes.OK);
      });

      it(`should return ${limit} records`, () => {
        expect(response.body.data).toHaveLength(limit);
      });

      it('should return the total count of records', () => {
        expect(response.body.totalCount).toBe(numberOfRecords);
      });

      it('should return cursor', () => {
        expect(response.body.cursor).not.toBeNull();
      });

      it('should return books with the same publication year', () => {
        const { data } = response.body;
        for (const record of data) {
          expect(record.publicationYear).toEqual(publicationYear);
        }
      });

      it('should fetch next set of records using cursor', async () => {
        const {
          body: { data },
        } = await request.get(path).query({ publicationYear, cursor: response.body.cursor, limit });
        expect(data).not.toEqual(response.body.data);
        for (const record of data) {
          expect(record.publicationYear).toEqual(publicationYear);
        }
      });
    });
  });

  describe('when an invalid request is made', () => {
    beforeEach(async () => {
      const publicationYear = publicationYearFixtures.invalid();
      response = await request.get(path).query({ publicationYear, limit });
    });

    it('should return status code 400', () => {
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should return an error message', () => {
      expect(response.body).toEqual({
        message: 'publicationYear must be a number',
        status: 'Bad Request',
        statusCode: StatusCodes.BAD_REQUEST,
      });
    });
  });
});
