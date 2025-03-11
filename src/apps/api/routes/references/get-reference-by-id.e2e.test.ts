import supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';

import app from '@api/app';
import { dropReferencesCollection } from '@tests/utils/mocks/db';
import { Reference } from '@modules/shared/references/domain/reference';
import { referenceFixtures } from '@tests/utils/fixtures/references/reference-fixtures';
import { referenceIdFixtures } from '@tests/utils/fixtures/references/reference-id-fixtures';

import { toDTO } from './dto/reference-dto';

describe('GET /references/:id', () => {
  const request = supertest.agent(app);
  const path = '/api/references/:id';
  let response: supertest.Response;

  beforeEach(async () => {
    await dropReferencesCollection();
  });

  describe('when reference exists', () => {
    let reference: Reference;
    beforeEach(async () => {
      reference = await referenceFixtures.insert();

      response = await request.get(path.replace(':id', reference.id));
    });

    it('should return 200 status code', () => {
      expect(response.statusCode).toBe(StatusCodes.OK);
    });

    it('should return valid reference', () => {
      expect(response.body).toEqual({
        ...toDTO(reference),
        createdAt: reference.createdAt.toISOString(),
        updatedAt: reference.updatedAt.toISOString(),
      });
    });
  });

  describe('when reference does not exist', () => {
    const id = referenceIdFixtures.create();
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
        message: `Reference with id ${id} does not exists`,
      });
    });
  });

  describe('when invalid id is provided', () => {
    beforeEach(async () => {
      response = await request.get(path.replace(':id', referenceIdFixtures.urlInvalid));
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
