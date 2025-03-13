import supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';

import app from '@api/app';
import { userIdFixtures } from '@tests/utils/fixtures/users/user-id-fixtures';
import { referenceIdFixtures } from '@tests/utils/fixtures/references/reference-id-fixtures';
import { reservationFixtures } from '@tests/utils/fixtures/reservations/reservation-fixtures';

describe('GET /users/me/reservations', () => {
  const request = supertest.agent(app);
  let response: supertest.Response;
  const path = '/api/users/me/reservations';

  const userId = userIdFixtures.create();
  const referenceId = referenceIdFixtures.create();
  const numberOfReservations = 5;

  describe('when valid request is made', () => {
    beforeAll(async () => {
      await Promise.all([
        await reservationFixtures.insertMany({ reservation: { userId }, length: numberOfReservations }),
        await reservationFixtures.insertMany({ reservation: { referenceId }, length: numberOfReservations }),
        await reservationFixtures.insertMany({ reservation: { userId, referenceId }, length: numberOfReservations }),
      ]);
    });

    describe('userId', () => {
      beforeEach(async () => {
        response = await request.get(path).set('Authorization', userId);
      });

      it('should return status code 200', async () => {
        expect(response.status).toBe(StatusCodes.OK);
      });

      it('should return reservations with the same userId', () => {
        const { body } = response;
        for (const reservations of body) {
          expect(reservations.userId).toEqual(userId);
        }
      });
    });
  });

  describe('when user id not provided', () => {
    beforeEach(async () => {
      response = await request.get(path).set('Authorization', '');
    });

    it('should return status code 401', () => {
      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    });
  });
});
