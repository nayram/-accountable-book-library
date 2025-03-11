import { createDomainEvent, DomainEvent } from '@modules/shared/core/domain/domain-events/domain-event';

export interface SendReservationDueDateReminderPayload {
  email: string;
  name: string;
  referenceTitle: string;
}

export const SEND_RESERVATION_DUE_DATE_REMINDER_EVENT_NAME = 'library.reservations.send_due_date_reminder';

export function createSendReservationDueDateReminderDomainEvent(
  payload: SendReservationDueDateReminderPayload,
): DomainEvent<SendReservationDueDateReminderPayload> {
  return createDomainEvent({
    name: SEND_RESERVATION_DUE_DATE_REMINDER_EVENT_NAME,
    payload,
  });
}
