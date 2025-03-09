import config from 'config';

import { Entity } from '@modules/shared/core/domain/entity';
import { createUserId, UserId } from '@modules/shared/users/domain/user/user-id';
import { createReferenceId, ReferenceId } from '@modules/shared/references/domain/reference-id';
import { Balance } from '@modules/shared/wallets/domain/wallet/balance';
import { BookId, createBookId } from '@modules/shared/books/domain/book/book-id';
import { Money } from '@modules/shared/core/domain/value-objects/money';

import { createReservationId, ReservationId } from './reservation-id';
import { ReservationStatus } from './reservation-status';
import { ReservationDueAt } from './reservation-due-at';

export const reservationCost = config.get<Money>('reservationCost');
export const borrowLimit = config.get<number>('borrowLimit');

export type Reservation = Entity<{
  id: ReservationId;
  userId: UserId;
  bookId: BookId;
  status: ReservationStatus;
  reservationFee: Money;
  lateFee: Money;
  referenceId: ReferenceId;
  reservedAt: Date;
  borrowedAt: Date | null;
  returnedAt: Date | null;
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
