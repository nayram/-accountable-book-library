import { Entity } from '@modules/shared/core/domain/entity';
import { createReservationId, ReservationId } from './reservation-id';
import { createUserId, UserId } from '@modules/shared/users/domain/user-id';
import { createReferenceId, ReferenceId } from '@modules/shared/references/domain/reference-id';

export type Reservation = Entity<{
  id: ReservationId;
  userId: UserId;
  referenceId: ReferenceId;
}>;

interface ReservationPrimitives {
  id: string;
  userId: string;
  referenceId: string;
}
export function createReservation({ id, userId, referenceId }: ReservationPrimitives): Reservation {
  return {
    id: createReservationId(id),
    userId: createUserId(userId),
    referenceId: createReferenceId(referenceId),
  };
}
