import { describe } from 'node:test';

import supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';

import app from '@api/app';
import { dropAllCollections } from '@tests/utils/mocks/db';
import { User } from '@modules/shared/users/domain/user/user';
import { reservationDueAtFixtures } from '@tests/utils/fixtures/reservations/reservation-due-at-fixtures';
import { Reservation } from '@modules/reservations/domain/reservation/reservation';
import { userFixtures } from '@tests/utils/fixtures/users/user-fixtures';
import { bookFixtures } from '@tests/utils/fixtures/books/book-fixtures';
import { referenceFixtures } from '@tests/utils/fixtures/references/reference-fixtures';
import { BookStatus } from '@modules/shared/books/domain/book/book-status';
import { reservationFixtures } from '@tests/utils/fixtures/reservations/reservation-fixtures';
import { ReservationStatus } from '@modules/reservations/domain/reservation/reservation-status';
import { reservationIdFixtures } from '@tests/utils/fixtures/reservations/reservation-id-fixtures';
import { userIdFixtures } from '@tests/utils/fixtures/users/user-id-fixtures';

import { PostBorrowBookRequest } from './post-borrow-book-request';

describe('POST /reservations/:id/borrow', () => {
  const request = supertest.agent(app);
  const path = '/api/reservations/:id/borrow';

  afterEach(async () => {
    await dropAllCollections();
  });

  describe('when valid request is sent', () => {
    let requestBody: PostBorrowBookRequest['body'];

    let user: User;
    let dueAt = reservationDueAtFixtures.create();
    let reservation: Reservation;
    let unReservedReservation: Reservation;

    const nonExistentReservationId = reservationIdFixtures.create();

    beforeEach(async () => {
      user = await userFixtures.insert();
      const reference = await referenceFixtures.insert();
      const book = await bookFixtures.insert({ referenceId: reference.id, status: BookStatus.Reserved });

      reservation = await reservationFixtures.insert({
        userId: user.id,
        bookId: book.id,
        referenceId: book.referenceId,
        status: ReservationStatus.Reserved,
        dueAt: null,
      });

      const unReservedBook = await bookFixtures.insert({
        referenceId: reference.id,
        status: BookStatus.Borrowed,
      });

      unReservedReservation = await reservationFixtures.insert({
        bookId: unReservedBook.id,
        referenceId: unReservedBook.referenceId,
        status: ReservationStatus.Borrowed,
        userId: user.id,
        dueAt,
      });
    });

    describe('and the reservation does not exist', () => {
      let response: supertest.Response;
      beforeEach(async () => {
        requestBody = {
          dueAt,
        };

        response = await request
          .post(path.replace(':id', nonExistentReservationId))
          .set('Authorization', user.id)
          .send(requestBody);
      });

      it('should return 404 status code', () => {
        expect(response.status).toBe(StatusCodes.NOT_FOUND);
      });

      it('should return an error message', () => {
        expect(response.body).toEqual({
          status: 'Not Found',
          statusCode: StatusCodes.NOT_FOUND,
          message: `reservation with id ${nonExistentReservationId} does not exist`,
        });
      });
    });

    describe('and the reservation status is not "reserved"', () => {
      let response: supertest.Response;
      beforeEach(async () => {
        requestBody = {
          dueAt,
        };

        response = await request
          .post(path.replace(':id', unReservedReservation.id))
          .set('Authorization', user.id)
          .send(requestBody);
      });

      it('should return 409 status code', () => {
        expect(response.status).toBe(StatusCodes.CONFLICT);
      });

      it('should return an error message', () => {
        expect(response.body).toEqual({
          status: 'Conflict',
          statusCode: StatusCodes.CONFLICT,
          message: 'Invalid reservation status',
        });
      });
    });

    describe('and a book is borrowed successfully', () => {
      let response: supertest.Response;
      beforeEach(async () => {
        requestBody = {
          dueAt,
        };

        response = await request
          .post(path.replace(':id', reservation.id))
          .set('Authorization', user.id)
          .send(requestBody);
      });

      it('should return a 204 status code', () => {
        expect(response.status).toBe(StatusCodes.NO_CONTENT);
      });
    });
  });

  describe('when an invalid request is sent', () => {
    let requestBody: PostBorrowBookRequest['body'];
    let response: supertest.Response;

    beforeEach(async () => {
      requestBody = {
        dueAt: reservationDueAtFixtures.create(),
      };

      response = await request
        .post(path.replace(':id', reservationIdFixtures.urlInvalid()))
        .set('Authorization', userIdFixtures.create())
        .send(requestBody);
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
