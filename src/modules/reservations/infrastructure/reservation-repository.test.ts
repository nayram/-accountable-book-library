import { faker } from '@faker-js/faker/locale/en';

import { Pagination } from '@modules/shared/core/domain/pagination';
import { reservationFixtures } from '@tests/utils/fixtures/reservations/reservation-fixtures';
import { referenceIdFixtures } from '@tests/utils/fixtures/references/reference-id-fixtures';
import { userIdFixtures } from '@tests/utils/fixtures/users/user-id-fixtures';
import { reservationStatusFixtures } from '@tests/utils/fixtures/reservations/reservation-status-fixtures';
import { reservationIdFixtures } from '@tests/utils/fixtures/reservations/reservation-id-fixtures';
import { ReservationDoesNotExistError } from '@modules/shared/reservations/domain/reservation-does-not-exist';

import { SearchParams } from '../domain/search-params';
import { reservationModel } from '../../shared/reservations/infrastructure/reservation-model';
import { ReservationStatus } from '../domain/reservation/reservation-status';

import { reservationRepository } from '.';

describe('ReservationRepository', () => {
  describe('findBySearchParams', () => {
    it('should find reservations by referenceId', async () => {
      const referenceId = referenceIdFixtures.create();

      await reservationFixtures.insertMany({ reservation: { referenceId } });
      await reservationFixtures.insertMany({});

      const searchParams = { referenceId };

      const reservations = await reservationRepository.findBySearchParams(searchParams);

      for (const reservation of reservations) {
        expect(reservation.referenceId).toBe(referenceId);
      }
    });

    it('should find reservations by userId', async () => {
      const userId = userIdFixtures.create();
      await reservationFixtures.insertMany({ reservation: { userId } });
      await reservationFixtures.insertMany({});

      const searchParams = { userId };

      const reservations = await reservationRepository.findBySearchParams(searchParams);

      for (const reservation of reservations) {
        expect(reservation.userId).toBe(userId);
      }
    });

    it('should find reservations by status', async () => {
      const status = reservationStatusFixtures.create();
      await reservationFixtures.insertMany({ reservation: { status } });
      await reservationFixtures.insertMany({});

      const searchParams = { status };

      const reservations = await reservationRepository.findBySearchParams(searchParams);

      for (const reservation of reservations) {
        expect(reservation.status).toBe(status);
      }
    });

    it('should find reservations by both userId and status', async () => {
      const status = reservationStatusFixtures.create();
      const userId = userIdFixtures.create();
      await reservationFixtures.insertMany({ reservation: { status, userId } });
      await reservationFixtures.insertMany({});

      const searchParams = { status, userId };

      const reservations = await reservationRepository.findBySearchParams(searchParams);

      for (const reservation of reservations) {
        expect(reservation.status).toBe(status);
        expect(reservation.userId).toBe(userId);
      }
    });

    it('should find reservations by both referenceId and userId', async () => {
      const userId = userIdFixtures.create();
      const referenceId = referenceIdFixtures.create();

      const searchParams = { referenceId, userId };
      const reservations = await reservationRepository.findBySearchParams(searchParams);

      for (const reservation of reservations) {
        expect(reservation.userId).toBe(userId);
        expect(reservation.referenceId).toBe(referenceId);
      }
    });
  });

  describe('findById', () => {
    it('should throw ReservationDoesNotExistError if no corresponding reservation data is found', async () => {
      await expect(reservationRepository.findById(reservationIdFixtures.create())).rejects.toThrow(
        ReservationDoesNotExistError,
      );
    });

    it('should return reservation', async () => {
      const reservation = await reservationFixtures.insert({});
      const result = await reservationRepository.findById(reservation.id);
      expect(result).not.toBeNull();
      expect(result.id).toBe(reservation.id);
    });
  });

  describe('find', () => {
    beforeEach(async () => {
      await reservationModel.deleteMany({});
    });

    describe('Basic pagination', () => {
      it('should return paginated reservations with next cursor', async () => {
        const totalCount = 4;
        const limit = 2;
        const reservations = await reservationFixtures.insertMany({ length: totalCount });
        const pagination: Pagination = {
          limit,
          cursor: null,
          sortBy: 'reservedAt',
          sortOrder: 'asc',
        };

        const result = await reservationRepository.find(pagination, {});

        expect(result.data.length).toBe(limit);
        expect(result.totalCount).toBe(totalCount);
        expect(result.cursor).not.toBeNull();

        expect(result.data).toEqual(
          reservations.sort((a, b) => a.reservedAt.getTime() - b.reservedAt.getTime()).slice(0, limit),
        );
      });

      it('should return less than limit when not enough items exist', async () => {
        const totalCount = 2;
        const limit = 5;
        await reservationFixtures.insertMany({ length: totalCount });
        const pagination: Pagination = {
          limit,
          cursor: null,
          sortBy: 'reservedAt',
          sortOrder: 'asc',
        };

        const result = await reservationRepository.find(pagination, {});

        expect(result.data.length).toBe(totalCount);
        expect(result.totalCount).toBe(totalCount);
        expect(result.cursor).toBeNull();
      });
    });

    describe('Search parameters', () => {
      it('should return reservations matching referenceId search parameter', async () => {
        const count = 4;
        const referenceId = referenceIdFixtures.create();
        const limit = 2;

        await reservationFixtures.insertMany({ reservation: { referenceId }, length: count });
        await reservationFixtures.insertMany({ length: count });

        const pagination: Pagination = {
          limit,
          cursor: null,
          sortBy: 'createdAt',
          sortOrder: 'asc',
        };
        const searchParams: SearchParams = { referenceId };
        const { data, totalCount, cursor } = await reservationRepository.find(pagination, searchParams);

        expect(data.length).toBe(limit);
        expect(totalCount).toBe(count);
        expect(cursor).not.toBeNull();

        for (const reservation of data) {
          expect(reservation.referenceId).toEqual(referenceId);
        }
      });

      it('should return reservations matching userId search parameter', async () => {
        const userId = userIdFixtures.create();
        const otherUserID = userIdFixtures.create();

        await reservationFixtures.insertMany({ reservation: { userId }, length: 3 });
        await reservationFixtures.insertMany({ reservation: { userId: otherUserID }, length: 2 });

        const pagination: Pagination = {
          limit: 10,
          cursor: null,
          sortBy: 'reservedAt',
          sortOrder: 'asc',
        };
        const searchParams: SearchParams = { userId };

        const result = await reservationRepository.find(pagination, searchParams);
        expect(result.data.length).toBe(3);
        expect(result.totalCount).toBe(3);

        for (const reservation of result.data) {
          expect(reservation.userId).toEqual(userId);
        }
      });
    });

    describe('Cursor pagination', () => {
      it('should fetch next batch of data using the cursor', async () => {
        const totalItems = 5;
        const limit = 2;
        const reservations = await reservationFixtures.insertMany({ length: totalItems });

        const pagination: Pagination = {
          limit,
          cursor: null,
          sortBy: 'reservedAt',
          sortOrder: 'asc',
        };

        const firstBatch = await reservationRepository.find(pagination, {});

        expect(firstBatch.data.length).toBe(limit);
        expect(firstBatch.totalCount).toBe(totalItems);
        expect(firstBatch.cursor).not.toBeNull();

        expect(firstBatch.data).toEqual(
          reservations.sort((a, b) => a.reservedAt.getTime() - b.reservedAt.getTime()).slice(0, limit),
        );

        const secondPagination: Pagination = {
          limit,
          cursor: firstBatch.cursor,
          sortBy: 'reservedAt',
          sortOrder: 'asc',
        };
        const secondBatch = await reservationRepository.find(secondPagination, {});

        expect(secondBatch.data.length).toBe(limit);
        expect(secondBatch.totalCount).toBe(totalItems);
        expect(secondBatch.cursor).not.toBeNull();

        expect(secondBatch.data).toEqual(
          reservations.sort((a, b) => a.reservedAt.getTime() - b.reservedAt.getTime()).slice(limit, totalItems - 1),
        );

        const thirdPagination: Pagination = {
          limit,
          cursor: secondBatch.cursor,
          sortBy: 'reservedAt',
          sortOrder: 'asc',
        };
        const thirdBatch = await reservationRepository.find(thirdPagination, {});

        expect(thirdBatch.data.length).toBe(1);
        expect(thirdBatch.totalCount).toBe(totalItems);
        expect(thirdBatch.cursor).toBeNull();

        expect(thirdBatch.data).toEqual(
          reservations.sort((a, b) => a.reservedAt.getTime() - b.reservedAt.getTime()).slice(-1),
        );
      });
    });
  });

  describe('save', () => {
    it('should create a new reservation if it does not exist', async () => {
      const newReservation = reservationFixtures.create({
        dueAt: faker.date.future(),
        returnedAt: null,
        borrowedAt: faker.date.recent(),
      });

      await reservationRepository.save(newReservation);

      const result = await reservationRepository.findById(newReservation.id);

      expect(result.id).toEqual(newReservation.id);
      expect(result.userId).toEqual(newReservation.userId);
      expect(result.bookId).toEqual(newReservation.bookId);
      expect(result.referenceId).toEqual(newReservation.referenceId);
      expect(result.reservationFee).toEqual(newReservation.reservationFee);
      expect(result.lateFee).toEqual(newReservation.lateFee);
      expect(result.status).toEqual(newReservation.status);
      expect(result.dueAt?.toISOString()).toEqual(newReservation.dueAt?.toISOString());
      expect(result.borrowedAt?.toISOString()).toEqual(newReservation.borrowedAt?.toISOString());
      expect(result.reservedAt.toISOString()).toEqual(newReservation.reservedAt.toISOString());
      expect(result.returnedAt).toBeNull();
    });

    it('should update an existing reservation (all fields) if it exists', async () => {
      const existingReservation = await reservationFixtures.insert({
        dueAt: null,
        returnedAt: null,
        borrowedAt: null,
      });

      const updatedReservation = reservationFixtures.create({
        id: existingReservation.id,
        userId: existingReservation.userId,
        bookId: existingReservation.bookId,
        referenceId: existingReservation.referenceId,
        reservedAt: existingReservation.reservedAt,
        lateFee: 0.2,
        status: ReservationStatus.Borrowed,
        borrowedAt: faker.date.recent(),
        returnedAt: null,
        dueAt: faker.date.future(),
      });

      await reservationRepository.save(updatedReservation);

      const result = await reservationRepository.findById(existingReservation.id);

      expect(result.id).toEqual(updatedReservation.id);
      expect(result.userId).toEqual(updatedReservation.userId);
      expect(result.bookId).toEqual(updatedReservation.bookId);
      expect(result.referenceId).toEqual(updatedReservation.referenceId);
      expect(result.lateFee).toEqual(updatedReservation.lateFee);
      expect(result.reservationFee).toEqual(updatedReservation.reservationFee);
      expect(result.borrowedAt?.toISOString()).toEqual(updatedReservation.borrowedAt?.toISOString());
      expect(result.returnedAt).toBeNull();
      expect(result.dueAt?.toISOString()).toEqual(updatedReservation.dueAt?.toISOString());
      expect(result.status).toEqual(updatedReservation.status);
      expect(result.reservedAt.toISOString()).toEqual(updatedReservation.reservedAt.toISOString());
    });
  });
});
