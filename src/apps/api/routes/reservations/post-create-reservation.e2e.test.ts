import app from '@api/app';
import supertest from 'supertest';
import { referenceIdFixtures } from '@tests/utils/fixtures/references/reference-id-fixtures';
import { referenceFixtures } from '@tests/utils/fixtures/references/reference-fixtures';
import { userFixtures } from '@tests/utils/fixtures/users/user-fixtures';
import { Reference } from '@modules/shared/references/domain/reference';
import { User } from '@modules/shared/users/domain/user/user';
import { StatusCodes } from 'http-status-codes';
import { userIdFixtures } from '@tests/utils/fixtures/users/user-id-fixtures';
import { walletFixtures } from '@tests/utils/fixtures/wallet/wallet-fixtures';
import { bookFixtures } from '@tests/utils/fixtures/books/book-fixtures';
import { BookStatus } from '@modules/shared/books/domain/book/book-status';
import { faker } from '@faker-js/faker/locale/en';
import { dropAllCollections } from '@tests/utils/mocks/db';

import { PostCreateReservationRequest } from './post-create-reservation.request';

describe('POST /reservations', () => {
  const request = supertest.agent(app);
  const path = '/api/reservations';

  afterEach(async () => {
    await dropAllCollections();
  });

  describe('when a valid body is sent', () => {
    let requestBody: PostCreateReservationRequest['body'];
    let response: supertest.Response;
    let reference: Reference;
    let referenceWithoutAvailableBooks: Reference;
    let user: User;
    let userWithoutEnoughFunds: User;

    const nonExistentReferenceId = referenceIdFixtures.create();
    const nonExistentUserId = userIdFixtures.create();

    beforeEach(async () => {
      reference = await referenceFixtures.insert();
      referenceWithoutAvailableBooks = await referenceFixtures.insert();

      user = await userFixtures.insert();
      userWithoutEnoughFunds = await userFixtures.insert();

      await walletFixtures.insert({ userId: user.id });

      await walletFixtures.insert({ userId: userWithoutEnoughFunds.id, balance: 0 });

      await bookFixtures.insertMany({ book: { referenceId: reference.id, status: BookStatus.Available } });

      await bookFixtures.insertMany({
        book: {
          referenceId: referenceWithoutAvailableBooks.id,
          status: faker.helpers.arrayElement([BookStatus.Borrowed, BookStatus.Reserved]) as unknown as BookStatus,
        },
      });
    });

    describe('and the reference does not exist', () => {
      beforeEach(async () => {
        requestBody = {
          referenceId: nonExistentReferenceId,
          userId: user.id,
        };

        response = await request.post(path).send(requestBody);
      });

      it('should return a 404 status', () => {
        expect(response.status).toEqual(StatusCodes.NOT_FOUND);
      });

      it('should return an error response', () => {
        expect(response.body).toEqual({
          status: 'Not Found',
          statusCode: StatusCodes.NOT_FOUND,
          message: `reference with id ${nonExistentReferenceId} does not exist`,
        });
      });
    });

    describe('and the user does not exist', () => {
      beforeEach(async () => {
        requestBody = {
          referenceId: reference.id,
          userId: nonExistentUserId,
        };

        response = await request.post(path).send(requestBody);
      });

      it('should return a 404 status', () => {
        expect(response.status).toEqual(StatusCodes.NOT_FOUND);
      });

      it('should return an error response', () => {
        expect(response.body).toEqual({
          status: 'Not Found',
          statusCode: StatusCodes.NOT_FOUND,
          message: `user with id ${nonExistentUserId} does not exist`,
        });
      });
    });

    describe('and the user has no funds', () => {
      beforeEach(async () => {
        requestBody = {
          referenceId: reference.id,
          userId: userWithoutEnoughFunds.id,
        };

        response = await request.post(path).send(requestBody);
      });

      it('should return a 402 status', () => {
        expect(response.status).toEqual(StatusCodes.PAYMENT_REQUIRED);
      });

      it('should return an eror response', () => {
        expect(response.body).toEqual({
          status: 'Payment Required',
          statusCode: StatusCodes.PAYMENT_REQUIRED,
          message: 'Insufficient funds. Please add funds to your wallet.',
        });
      });
    });

    describe('and there are no available books', () => {
      beforeEach(async () => {
        requestBody = {
          userId: user.id,
          referenceId: referenceWithoutAvailableBooks.id,
        };

        response = await request.post(path).send(requestBody);
      });

      it('should return a 409 status', () => {
        expect(response.status).toEqual(StatusCodes.CONFLICT);
      });

      it('should return an error response', () => {
        expect(response.body).toEqual({
          status: 'Conflict',
          statusCode: StatusCodes.CONFLICT,
          message: `There are no available books for reference with id ${referenceWithoutAvailableBooks.id}`,
        });
      });
    });

    describe.only('and reservation is created successfully', () => {
      beforeEach(async () => {
        requestBody = {
          userId: user.id,
          referenceId: reference.id,
        };
        response = await request.post(path).send(requestBody);
      });

      it('should return a 201', () => {
        expect(response.status).toEqual(StatusCodes.CREATED);
      });

      it('should return reservation data', () => {
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('userId', user.id);
        expect(response.body).toHaveProperty('referenceId', reference.id);
        expect(response.body).toHaveProperty('bookId');
        expect(response.body).toHaveProperty('reservedAt');
      });

      it('should debit wallet');
    });
  });

  describe('when an invalid body is sent', () => {
    let requestBody: PostCreateReservationRequest['body'];
    let response: supertest.Response;

    beforeEach(async () => {
      requestBody = {
        userId: userIdFixtures.invalid(),
        referenceId: referenceIdFixtures.create(),
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
