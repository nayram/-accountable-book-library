import config from 'config';

import { Entity } from '@modules/shared/core/domain/entity';
import { createUserId, UserId } from '@modules/shared/users/domain/user/user-id';
import { createReferenceId, ReferenceId } from '@modules/shared/references/domain/reference-id';
import { Balance } from '@modules/shared/wallets/domain/wallet/balance';
import { BookId, createBookId } from '@modules/shared/books/domain/book/book-id';
import { Money } from '@modules/shared/core/domain/value-objects/money';

import { createReservationId, ReservationId } from './reservation-id';
import { createReservationStatus, ReservationStatus } from './reservation-status';
import { createReservationDueAt, ReservationDueAt } from './reservation-due-at';
import { createLateFee, LateFee } from './late-fee';
import { createReservationReturnAt, ReservationReturnAt } from './reservation-return-at';

export const reservationCost = config.get<Money>('reservationCost');
export const borrowLimit = config.get<number>('borrowLimit');
export const lateReturnPenalty = config.get<Money>('lateFee');

export type Reservation = Entity<{
  id: ReservationId;
  userId: UserId;
  bookId: BookId;
  status: ReservationStatus;
  reservationFee: Money;
  lateFee: LateFee;
  referenceId: ReferenceId;
  reservedAt: Date;
  borrowedAt: Date | null;
  returnedAt: ReservationReturnAt | null;
  dueAt: ReservationDueAt | null;
}>;

export type ReservationUpdate = Readonly<{
  status: ReservationStatus;
  lateFee: LateFee;
  borrowedAt: Date | null;
  returnedAt: ReservationReturnAt | null;
  dueAt: ReservationDueAt | null;
}>;

interface ReservationPrimitives {
  id: string;
  userId: string;
  bookId: string;
  referenceId: string;
}

export function createReservation({ id, userId, bookId, referenceId }: ReservationPrimitives): Reservation {
  return {
    id: createReservationId(id),
    userId: createUserId(userId),
    bookId: createBookId(bookId),
    status: ReservationStatus.Reserved,
    reservationFee: reservationCost,
    lateFee: 0,
    referenceId: createReferenceId(referenceId),
    reservedAt: new Date(),
    borrowedAt: null,
    dueAt: null,
    returnedAt: null,
  };
}

interface ReservationUpdatePrimitives {
  status: string;
  lateFee: number;
  borrowedAt: Date | null;
  returnedAt: string | null;
  dueAt: string | null;
}

export function createReservationUpdate(primitives: ReservationUpdatePrimitives): ReservationUpdate {
  return {
    status: createReservationStatus(primitives.status),
    lateFee: createLateFee(primitives.lateFee),
    borrowedAt: primitives.borrowedAt || null,
    returnedAt: primitives.returnedAt ? createReservationReturnAt(primitives.returnedAt) : null,
    dueAt: primitives.dueAt ? createReservationDueAt(primitives.dueAt) : null,
  };
}

export function update(reservation: Reservation, reservationUpdate: ReservationUpdate): Reservation {
  return {
    id: reservation.id,
    userId: reservation.userId,
    bookId: reservation.bookId,
    referenceId: reservation.referenceId,
    reservationFee: reservation.reservationFee,
    reservedAt: reservation.reservedAt,
    lateFee: reservationUpdate.lateFee,
    status: reservationUpdate.status,
    borrowedAt: reservationUpdate.borrowedAt,
    returnedAt: reservationUpdate.returnedAt,
    dueAt: reservationUpdate.dueAt,
  };
}

export function canAfford(walletBalance: Balance) {
  return walletBalance >= reservationCost;
}

export function isValidReservation(
  reservations: Reservation[],
  referenceId: ReferenceId,
): { isValid: boolean; reason?: string } {
  const currentlyBorrowedBooks = reservations.filter(
    (reservation) => reservation.status === ReservationStatus.Borrowed,
  );

  if (currentlyBorrowedBooks.length >= borrowLimit) {
    return { isValid: false, reason: 'Borrow limit reached' };
  }

  if (currentlyBorrowedBooks.some((borrow) => borrow.referenceId === referenceId)) {
    return { isValid: false, reason: 'Already borrowed book with the same reference' };
  }

  return { isValid: true };
}

export function calculateLateFees(reservation: Reservation): Reservation {
  let penalty = 0;
  if (reservation.status === ReservationStatus.Returned && reservation.dueAt && reservation.returnedAt) {
    const dueDate = new Date(reservation.dueAt);
    const returnDate = new Date(reservation.returnedAt);
    if (returnDate.getTime() > dueDate.getTime()) {
      const daysLate = Math.ceil((returnDate.getTime() - dueDate.getTime()) / (1000 * 3600 * 24));
      penalty = lateReturnPenalty * daysLate;
    }
  }

  return {
    ...reservation,
    lateFee: penalty,
  };
}
