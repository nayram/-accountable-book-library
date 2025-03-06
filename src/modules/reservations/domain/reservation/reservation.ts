import { Entity } from '@modules/shared/core/domain/entity';
import { createUserId, UserId } from '@modules/shared/users/domain/user/user-id';
import { createReferenceId, ReferenceId } from '@modules/shared/references/domain/reference-id';
import { Balance } from '@modules/shared/wallets/domain/wallet/balance';
import { BookId, createBookId } from '@modules/shared/books/domain/book/book-id';

import { createReservationId, ReservationId } from './reservation-id';

export const reservationCost = 3;

export type Reservation = Entity<{
  id: ReservationId;
  userId: UserId;
  bookId: BookId;
  referenceId: ReferenceId;
  reservedAt: Date;
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
    referenceId: createReferenceId(referenceId),
    reservedAt: new Date(),
  };
}

export function canAfford(walletBalance: Balance) {
  return walletBalance >= reservationCost;
}
