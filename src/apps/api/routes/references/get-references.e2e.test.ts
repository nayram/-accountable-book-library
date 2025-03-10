import supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';

import app from '@api/app';
import { authorFixtures } from '@tests/utils/fixtures/references/author-fixtures';
import { titleFixtures } from '@tests/utils/fixtures/references/title-fixtures';
import { referenceFixtures } from '@tests/utils/fixtures/references/reference-fixtures';
import { publicationYearFixtures } from '@tests/utils/fixtures/references/publication-year-fixtures';
import { dropAllCollections } from '@tests/utils/mocks/db';

describe('GET /references/search', () => {
  const request = supertest.agent(app);
  let response: supertest.Response;
  const path = '/api/references/search';

  const author = authorFixtures.create();
  const title = titleFixtures.create();
  const publicationYear = 1900;
  const numberOfreferences = 5;
  const limit = 2;

  describe('when valid request is made', () => {
    beforeEach(async () => {
      await Promise.all([
        await referenceFixtures.insertMany({ reference: { author }, length: numberOfreferences }),
        await referenceFixtures.insertMany({ reference: { title }, length: numberOfreferences }),
        await referenceFixtures.insertMany({ reference: { publicationYear }, length: numberOfreferences }),
      ]);
    });

    afterEach(async () => {
      await dropAllCollections();
    });

    describe('author', () => {
      beforeEach(async () => {
        response = await request.get(path).query({ author, limit });
      });

      it('should return status code 200', async () => {
        expect(response.status).toBe(StatusCodes.OK);
      });

      it(`should return ${limit} references`, () => {
        expect(response.body.data).toHaveLength(limit);
      });

      it('should return the total count of references', () => {
        expect(response.body.totalCount).toBe(numberOfreferences);
      });

      it('should return cursor', () => {
        expect(response.body.cursor).not.toBeNull();
      });

      it('should return references with the same author', () => {
        const { data } = response.body;
        for (const reference of data) {
          expect(reference.author).toEqual(author);
        }
      });

      it('should fetch next set of references using cursor', async () => {
        const {
          body: { data },
        } = await request.get(path).query({ author, cursor: response.body.cursor, limit });
        expect(data).not.toEqual(response.body.data);
        for (const reference of data) {
          expect(reference.author).toEqual(author);
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

      it(`should return ${limit} references`, () => {
        expect(response.body.data).toHaveLength(limit);
      });

      it('should return the total count of references', () => {
        expect(response.body.totalCount).toBe(numberOfreferences);
      });

      it('should return cursor', () => {
        expect(response.body.cursor).not.toBeNull();
      });

      it('should return references with the same title', () => {
        const { data } = response.body;
        for (const reference of data) {
          expect(reference.title).toEqual(title);
        }
      });

      it('should fetch next set of references using cursor', async () => {
        const {
          body: { data },
        } = await request.get(path).query({ author, cursor: response.body.cursor, limit });
        expect(data).not.toEqual(response.body.data);
        for (const reference of data) {
          expect(reference.author).toEqual(author);
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

      it(`should return ${limit} references`, () => {
        expect(response.body.data).toHaveLength(limit);
      });

      it('should return the total count of references', () => {
        expect(response.body.totalCount).toBe(numberOfreferences);
      });

      it('should return cursor', () => {
        expect(response.body.cursor).not.toBeNull();
      });

      it('should return references with the same publication year', () => {
        const { data } = response.body;
        for (const reference of data) {
          expect(reference.publicationYear).toEqual(publicationYear);
        }
      });

      it('should fetch next set of references using cursor', async () => {
        const {
          body: { data },
        } = await request.get(path).query({ publicationYear, cursor: response.body.cursor, limit });
        expect(data).not.toEqual(response.body.data);
        for (const reference of data) {
          expect(reference.publicationYear).toEqual(publicationYear);
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
