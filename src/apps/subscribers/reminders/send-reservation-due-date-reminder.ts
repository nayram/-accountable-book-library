import { RemindUserOfDueDatesUseCase } from '@modules/reminders/application/remind-user-of-due-date';
import { DomainEventSubscriber } from '@modules/shared/core/domain/domain-events/domain-event-subscriber';
import {
  SEND_RESERVATION_DUE_DATE_REMINDER_EVENT_NAME,
  SendReservationDueDateReminderPayload,
} from 'src/apps/workers/reservations/domain/domain-events/send-reservation-due-date-reminder';

export function sendReservationDueDateSubscriberBuilder({
  remindUserOfDueDates,
}: {
  remindUserOfDueDates: RemindUserOfDueDatesUseCase;
}): DomainEventSubscriber<SendReservationDueDateReminderPayload> {
  return {
    getName() {
      return 'send_reservation_due_date_reminder';
    },
    subscribedTo() {
      return [SEND_RESERVATION_DUE_DATE_REMINDER_EVENT_NAME];
    },

    async on(event) {
      await remindUserOfDueDates(event.payload);
    },
  };
}
