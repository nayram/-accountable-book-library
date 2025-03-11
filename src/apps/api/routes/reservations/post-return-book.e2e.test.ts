import supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { faker } from '@faker-js/faker/locale/en';

import app from '@api/app';
import { reservationDueAtFixtures } from '@tests/utils/fixtures/reservations/reservation-due-at-fixtures';
import { Reservation } from '@modules/reservations/domain/reservation/reservation';
import { referenceFixtures } from '@tests/utils/fixtures/references/reference-fixtures';
import { reservationIdFixtures } from '@tests/utils/fixtures/reservations/reservation-id-fixtures';
import { dropAllCollections } from '@tests/utils/mocks/db';
import { User } from '@modules/shared/users/domain/user/user';
import { userFixtures } from '@tests/utils/fixtures/users/user-fixtures';
import { bookFixtures } from '@tests/utils/fixtures/books/book-fixtures';
import { BookStatus } from '@modules/shared/books/domain/book/book-status';
import { reservationFixtures } from '@tests/utils/fixtures/reservations/reservation-fixtures';
import { ReservationStatus } from '@modules/reservations/domain/reservation/reservation-status';
import { convertISOToDateString } from '@modules/shared/core/domain/value-objects/iso-date';
import { reservationModel } from '@modules/shared/reservations/infrastructure/reservation-model';
import { walletFixtures } from '@tests/utils/fixtures/wallet/wallet-fixtures';

import { PostReturnBookRequest } from './post-return-book-request';

describe('POST /reservations/:id/return', () => {
  const request = supertest.agent(app);
  const path = '/api/reservations/:id/return';

  afterEach(async () => {
    await dropAllCollections();
  });

  describe('when valid request is sent', () => {
    let requestBody: PostReturnBookRequest['body'];
    let response: supertest.Response;
    let user: User;
    let reservation: Reservation;
    let reservationWithoutBorrowedStatus: Reservation;
    let reservationWithPossibleLateFees: Reservation;

    const nonExistentReservationId = reservationIdFixtures.create();
    const date = faker.date.recent();
    const returnedAt = convertISOToDateString(date);

    beforeEach(async () => {
      user = await userFixtures.insert();
      await walletFixtures.insert({ userId: user.id });
      const reference = await referenceFixtures.insert();
      const borrowedBook = await bookFixtures.insert({ referenceId: reference.id, status: BookStatus.Borrowed });
      const borrowedBook2 = await bookFixtures.insert({ referenceId: reference.id, status: BookStatus.Borrowed });

      const dueDate = convertISOToDateString(date);
      const borrowedDate = faker.date.past();
      const reservedDate = faker.date.past();

      reservation = await reservationFixtures.insert({
        userId: user.id,
        bookId: borrowedBook.id,
        referenceId: borrowedBook.referenceId,
        status: ReservationStatus.Borrowed,
        dueAt: dueDate,
        reservedAt: reservedDate,
        borrowedAt: borrowedDate,
        lateFee: 0,
      });

      const book = await bookFixtures.insert({
        referenceId: reference.id,
        status: BookStatus.Reserved,
      });

      reservationWithoutBorrowedStatus = await reservationFixtures.insert({
        bookId: book.id,
        referenceId: book.referenceId,
        status: ReservationStatus.Reserved,
        userId: user.id,
        dueAt: null,
        reservedAt: reservedDate,
        returnedAt: null,
        lateFee: 0,
      });

      reservationWithPossibleLateFees = await reservationFixtures.insert({
        userId: user.id,
        bookId: borrowedBook2.id,
        referenceId: borrowedBook2.referenceId,
        status: ReservationStatus.Borrowed,
        borrowedAt: borrowedDate,
        reservedAt: reservedDate,
        dueAt: convertISOToDateString(faker.date.past()),
        lateFee: 0,
      });
    });

    describe('and the reservation does not exist', () => {
      beforeEach(async () => {
        requestBody = {
          returnedAt,
        };

        response = await request.post(path.replace(':id', nonExistentReservationId)).send(requestBody);
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

    describe('and the reservation status is not "borrowed"', () => {
      beforeEach(async () => {
        requestBody = {
          returnedAt,
        };

        response = await request.post(path.replace(':id', reservationWithoutBorrowedStatus.id)).send(requestBody);
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

    describe('and a book is returned successfully with no late fees', () => {
      beforeEach(async () => {
        requestBody = {
          returnedAt,
        };

        response = await request.post(path.replace(':id', reservation.id)).send(requestBody);
      });

      it('should return a 204 status code', () => {
        expect(response.status).toBe(StatusCodes.NO_CONTENT);
      });

      it('should not add lateFee to reservation', async () => {
        const result = await reservationModel.findById(reservation.id);
        expect(result?.late_fee).toBe(0);
      });
    });

    describe('and a book is returned successfully with late fees', () => {
      beforeEach(async () => {
        requestBody = {
          returnedAt,
        };

        response = await request.post(path.replace(':id', reservationWithPossibleLateFees.id)).send(requestBody);
      });

      it('should return a 204 status code', () => {
        expect(response.status).toBe(StatusCodes.NO_CONTENT);
      });

      it('should not add lateFee to reservation', async () => {
        const result = await reservationModel.findById(reservationWithPossibleLateFees.id);
        expect(result?.late_fee).not.toBe(0);
      });
    });
  });

  describe('when an invalid request is sent', () => {
    let requestBody: PostReturnBookRequest['body'];
    let response: supertest.Response;

    beforeEach(async () => {
      requestBody = {
        returnedAt: reservationDueAtFixtures.invalid(),
      };

      response = await request.post(path.replace(':id', reservationIdFixtures.urlInvalid())).send(requestBody);
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
