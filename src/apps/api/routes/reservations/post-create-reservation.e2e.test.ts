import supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { faker } from '@faker-js/faker/locale/en';

import app from '@api/app';
import { userFixtures } from '@tests/utils/fixtures/users/user-fixtures';
import { User } from '@modules/shared/users/domain/user/user';
import { userIdFixtures } from '@tests/utils/fixtures/users/user-id-fixtures';
import { walletFixtures } from '@tests/utils/fixtures/wallet/wallet-fixtures';
import { bookFixtures } from '@tests/utils/fixtures/books/book-fixtures';
import { BookStatus } from '@modules/shared/books/domain/book/book-status';
import { dropAllCollections } from '@tests/utils/mocks/db';
import { bookModel } from '@modules/shared/books/infrastructure/book-model';
import { reservationModel } from '@modules/shared/reservations/infrastructure/reservation-model';
import { bookIdFixtures } from '@tests/utils/fixtures/books/book-id-fixtures';
import { Book } from '@modules/shared/books/domain/book/book';
import { ReservationStatus } from '@modules/reservations/domain/reservation/reservation-status';
import { reservationFixtures } from '@tests/utils/fixtures/reservations/reservation-fixtures';

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
    let book: Book;
    let unAvailableBook: Book;
    let user: User;
    let userWithoutEnoughFunds: User;
    let userAtBorrowLimit: User;
    let userWithExistingBorrowedReference: User;

    const nonExistentBookId = bookIdFixtures.create();
    const nonExistentUserId = userIdFixtures.create();

    beforeEach(async () => {
      book = await bookFixtures.insert({ status: BookStatus.Available });
      unAvailableBook = await bookFixtures.insert({
        status: faker.helpers.arrayElement([BookStatus.Borrowed, BookStatus.Reserved]),
      });

      user = await userFixtures.insert();
      userAtBorrowLimit = await userFixtures.insert();
      userWithoutEnoughFunds = await userFixtures.insert();
      userWithExistingBorrowedReference = await userFixtures.insert();

      await walletFixtures.insert({ userId: userWithoutEnoughFunds.id, balance: 0 });
      await walletFixtures.insert({ userId: userWithExistingBorrowedReference.id });
      await walletFixtures.insert({ userId: user.id });

      await reservationFixtures.insertMany({
        reservation: { userId: userAtBorrowLimit.id, status: ReservationStatus.Borrowed },
        length: 3,
      });

      await reservationFixtures.insert({
        referenceId: book.referenceId,
        bookId: book.id,
        userId: userWithExistingBorrowedReference.id,
        status: ReservationStatus.Borrowed,
      });
    });

    describe('and the book does not exist', () => {
      beforeEach(async () => {
        requestBody = {
          bookId: nonExistentBookId,
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
          message: `book with id ${nonExistentBookId} does not exist`,
        });
      });
    });

    describe('and the user does not exist', () => {
      beforeEach(async () => {
        requestBody = {
          bookId: book.id,
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

    describe('and the user has reached the borrow limit', () => {
      beforeEach(async () => {
        requestBody = {
          userId: userAtBorrowLimit.id,
          bookId: book.id,
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
          message: `Borrow limit reached`,
        });
      });
    });

    describe('and a user who already has a reservation for a reference in the Borrowed status', () => {
      beforeEach(async () => {
        requestBody = {
          userId: userWithExistingBorrowedReference.id,
          bookId: book.id,
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
          message: `Already borrowed book with the same reference`,
        });
      });
    });

    describe('and the user has no funds', () => {
      beforeEach(async () => {
        requestBody = {
          bookId: book.id,
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

    describe('and book is not Available', () => {
      beforeEach(async () => {
        requestBody = {
          userId: user.id,
          bookId: unAvailableBook.id,
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
          message: `book with id ${unAvailableBook.id} is not available`,
        });
      });
    });

    describe('and reservation is created successfully', () => {
      beforeEach(async () => {
        requestBody = {
          userId: user.id,
          bookId: book.id,
        };
        response = await request.post(path).send(requestBody);
      });

      it('should return a 201', () => {
        expect(response.status).toEqual(StatusCodes.CREATED);
      });

      it('should return reservation data', async () => {
        const reservation = await reservationModel.findOne({
          user_id: user.id,
          book_id: book.id,
        });
        expect(response.body).toHaveProperty('id', reservation?.id);
        expect(response.body).toHaveProperty('userId', reservation?.user_id);
        expect(response.body).toHaveProperty('referenceId', reservation?.reference_id);
        expect(response.body).toHaveProperty('bookId', reservation?.book_id);
        expect(response.body).toHaveProperty('status', ReservationStatus.Reserved);
        expect(response.body).toHaveProperty('reservationFee', reservation?.reservation_fee);
        expect(response.body).toHaveProperty('lateFee', reservation?.late_fee);
        expect(response.body).toHaveProperty('dueAt', null);
        expect(response.body).toHaveProperty('returnedAt', null);
        expect(response.body).toHaveProperty('borrowedAt', null);
        expect(response.body).toHaveProperty('reservedAt', reservation?.reserved_at.toISOString());
      });

      it('should reserve a book', async () => {
        const reservation = await reservationModel.findOne({ user_id: user.id, book_id: book.id });
        const result = await bookModel.findById(reservation?.book_id);
        expect(result).not.toBeNull();
        expect(result?.status).toBe(BookStatus.Reserved);
      });
    });
  });

  describe('when an invalid body is sent', () => {
    let requestBody: PostCreateReservationRequest['body'];
    let response: supertest.Response;

    beforeEach(async () => {
      requestBody = {
        userId: userIdFixtures.invalid(),
        bookId: bookIdFixtures.create(),
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
