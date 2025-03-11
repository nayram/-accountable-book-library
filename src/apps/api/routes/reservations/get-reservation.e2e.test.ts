import supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';

import app from '@api/app';
import { reservationFixtures } from '@tests/utils/fixtures/reservations/reservation-fixtures';
import { Reservation } from '@modules/reservations/domain/reservation/reservation';
import { dropAllCollections } from '@tests/utils/mocks/db';
import { reservationIdFixtures } from '@tests/utils/fixtures/reservations/reservation-id-fixtures';

describe('GET /reservations/:id', () => {
  const request = supertest.agent(app);
  let response: supertest.Response;
  const path = '/api/reservations/:id';

  afterAll(async () => {
    await dropAllCollections();
  });

  describe('when valid request is made', () => {
    let reservation: Reservation;
    beforeEach(async () => {
      reservation = await reservationFixtures.insert();
      response = await request.get(path.replace(':id', reservation.id));
    });

    it('should return reservations with the same referenceId', () => {
      expect(response.body).toHaveProperty('id', reservation.id);
      expect(response.body).toHaveProperty('bookId', reservation.bookId);
      expect(response.body).toHaveProperty(
        'borrowedAt',
        reservation.borrowedAt ? reservation.borrowedAt.toISOString() : reservation.borrowedAt,
      );
      expect(response.body).toHaveProperty('dueAt', reservation.dueAt);
      expect(response.body).toHaveProperty('lateFee', reservation.lateFee);
      expect(response.body).toHaveProperty('referenceId', reservation.referenceId);
      expect(response.body).toHaveProperty('reservationFee', reservation.reservationFee);
      expect(response.body).toHaveProperty('returnedAt', reservation.returnedAt);
      expect(response.body).toHaveProperty('status', reservation.status);
      expect(response.body).toHaveProperty('userId', reservation.userId);
      expect(response.body).toHaveProperty('reservedAt', reservation.reservedAt.toISOString());
    });
  });

  describe('when an invalid request is made', () => {
    beforeEach(async () => {
      const reservationId = reservationIdFixtures.urlInvalid();
      response = await request.get(path.replace(':id', reservationId));
    });

    it('should return status code 400', () => {
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should return an error message', () => {
      expect(response.body).toEqual({
        message: expect.any(String),
        status: 'Bad Request',
        statusCode: StatusCodes.BAD_REQUEST,
      });
    });
  });
});
