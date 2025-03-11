import { createDomainEvent, DomainEvent } from '@modules/shared/core/domain/domain-events/domain-event';

export interface SendLateReturnReservationReminderPayload {
  email: string;
  name: string;
  referenceTitle: string;
}

export const SEND_LATE_RETURN_RESERVATION_REMINDER_EVENT_NAME = 'library.reservations.send_late_return_reminder';

export function createSendLateReturnReminderDomainEvent(
  payload: SendLateReturnReservationReminderPayload,
): DomainEvent<SendLateReturnReservationReminderPayload> {
  return createDomainEvent({
    name: SEND_LATE_RETURN_RESERVATION_REMINDER_EVENT_NAME,
    payload,
  });
}
