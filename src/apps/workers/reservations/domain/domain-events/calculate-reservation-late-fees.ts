import { createDomainEvent, DomainEvent } from '@modules/shared/core/domain/domain-events/domain-event';

export interface CalculateLateFeesPayload {
  reservationId: string;
}

export const CALCULATE_RESERVATOIN_LATE_FEES = 'library.reservations.calculate_reservation_late_fees';

export function createCalculateReservatoinLateFeesDomainEvent(
  payload: CalculateLateFeesPayload,
): DomainEvent<CalculateLateFeesPayload> {
  return createDomainEvent({
    name: CALCULATE_RESERVATOIN_LATE_FEES,
    payload,
  });
}
