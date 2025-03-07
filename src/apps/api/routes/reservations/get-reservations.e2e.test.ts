import supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';
import app from '@api/app';
import { userIdFixtures } from '@tests/utils/fixtures/users/user-id-fixtures';
import { referenceIdFixtures } from '@tests/utils/fixtures/references/reference-id-fixtures';
import { reservationFixtures } from '@tests/utils/fixtures/reservations/reservation-fixtures';

describe('GET /reservations', () => {
  const request = supertest.agent(app);
  let response: supertest.Response;
  const path = '/api/reservations';

  const userId = userIdFixtures.create();
  const referenceId = referenceIdFixtures.create();
  const numberOfReservations = 5;
  const limit = 2;

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
        response = await request.get(path).query({ userId, limit });
      });

      it('should return status code 200', async () => {
        expect(response.status).toBe(StatusCodes.OK);
      });

      it(`should return ${limit} reservations`, () => {
        expect(response.body.data).toHaveLength(limit);
      });

      it('should return the total count of reservations', () => {
        expect(response.body.totalCount).toBe(10);
      });

      it('should return cursor', () => {
        expect(response.body.cursor).not.toBeNull();
      });

      it('should return reservations with the same userId', () => {
        const { data } = response.body;
        for (const reservations of data) {
          expect(reservations.userId).toEqual(userId);
        }
      });

      it('should fetch next set of reservatons using cursor', async () => {
        const {
          body: { data },
        } = await request.get(path).query({ userId, cursor: response.body.cursor, limit });
        expect(data).not.toEqual(response.body.data);
        for (const reservations of data) {
          expect(reservations.userId).toEqual(userId);
        }
      });
    });

    describe('referenceId', () => {
      beforeEach(async () => {
        response = await request.get(path).query({ referenceId, limit });
      });

      it('should return status code 200', async () => {
        expect(response.status).toBe(StatusCodes.OK);
      });

      it(`should return ${limit} reservations`, () => {
        expect(response.body.data).toHaveLength(limit);
      });

      it('should return the total count of reservations', () => {
        expect(response.body.totalCount).toBe(10);
      });

      it('should return cursor', () => {
        expect(response.body.cursor).not.toBeNull();
      });

      it('should return reservations with the same referenceId', () => {
        const { data } = response.body;
        for (const reservation of data) {
          expect(reservation.referenceId).toEqual(referenceId);
        }
      });

      it('should fetch next set of reservations using cursor', async () => {
        const {
          body: { data },
        } = await request.get(path).query({ referenceId, cursor: response.body.cursor, limit });
        expect(data).not.toEqual(response.body.data);
        for (const reservation of data) {
          expect(reservation.referenceId).toEqual(referenceId);
        }
      });
    });

    describe('user id + referenceId', () => {
      beforeEach(async () => {
        response = await request.get(path).query({ referenceId, userId, limit });
      });

      it('should return status code 200', async () => {
        expect(response.status).toBe(StatusCodes.OK);
      });

      it(`should return ${limit} reservations`, () => {
        expect(response.body.data).toHaveLength(limit);
      });

      it('should return the total count of reservations', () => {
        expect(response.body.totalCount).toBe(numberOfReservations);
      });

      it('should return cursor', () => {
        expect(response.body.cursor).not.toBeNull();
      });

      it('should return reservations with the same user id and reference id', () => {
        const { data } = response.body;
        for (const reservation of data) {
          expect(reservation.userId).toEqual(userId);
          expect(reservation.referenceId).toEqual(referenceId);
        }
      });

      it('should fetch next set of reservations using cursor', async () => {
        const {
          body: { data },
        } = await request.get(path).query({ userId, referenceId, cursor: response.body.cursor, limit });
        expect(data).not.toEqual(response.body.data);
        for (const reservation of data) {
          expect(reservation.userId).toEqual(userId);
          expect(reservation.referenceId).toEqual(referenceId);
        }
      });
    });
  });

  describe('when an invalid request is made', () => {
    beforeEach(async () => {
      const userId = userIdFixtures.invalid();
      response = await request.get(path).query({ userId, limit });
    });

    it('should return status code 400', () => {
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should return an error message', () => {
      expect(response.body).toEqual({
        message: 'userId must be a uuid v4',
        status: 'Bad Request',
        statusCode: StatusCodes.BAD_REQUEST,
      });
    });
  });
});
