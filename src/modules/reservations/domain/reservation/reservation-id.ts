import { createUuid, Uuid } from '@modules/shared/core/domain/value-objects/uuid';

export type ReservationId = Uuid;

export function createReservationId(value: string) {
  return createUuid(value, 'reservationId');
}
