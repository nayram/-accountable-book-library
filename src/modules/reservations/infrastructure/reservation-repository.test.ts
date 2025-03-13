import { faker } from '@faker-js/faker/locale/en';

import { reservationFixtures } from '@tests/utils/fixtures/reservations/reservation-fixtures';
import { referenceIdFixtures } from '@tests/utils/fixtures/references/reference-id-fixtures';
import { userIdFixtures } from '@tests/utils/fixtures/users/user-id-fixtures';
import { reservationStatusFixtures } from '@tests/utils/fixtures/reservations/reservation-status-fixtures';
import { reservationIdFixtures } from '@tests/utils/fixtures/reservations/reservation-id-fixtures';
import { ReservationDoesNotExistError } from '@modules/shared/reservations/domain/reservation-does-not-exist';
import { reservationDueAtFixtures } from '@tests/utils/fixtures/reservations/reservation-due-at-fixtures';

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

  describe('save', () => {
    it('should create a new reservation if it does not exist', async () => {
      const newReservation = reservationFixtures.create({
        dueAt: reservationDueAtFixtures.create(),
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
      expect(result.dueAt).toEqual(newReservation.dueAt);
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
        dueAt: reservationDueAtFixtures.create(),
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
      expect(result.dueAt).toEqual(updatedReservation.dueAt);
      expect(result.status).toEqual(updatedReservation.status);
      expect(result.reservedAt.toISOString()).toEqual(updatedReservation.reservedAt.toISOString());
    });
  });
});
