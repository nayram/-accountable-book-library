import { RemindUserOfLateReturnsUseCase } from '@modules/reminders/application/remind-user-of-late-returns';
import { DomainEventSubscriber } from '@modules/shared/core/domain/domain-events/domain-event-subscriber';
import {
  SEND_LATE_RETURN_RESERVATION_REMINDER_EVENT_NAME,
  SendLateReturnReservationReminderPayload,
} from 'src/apps/workers/reservations/domain/domain-events/send-late-return-reservation-reminder';

export function sendLateReturnsReminderSubscriberBuilder({
  remindUserOfLateReturns,
}: {
  remindUserOfLateReturns: RemindUserOfLateReturnsUseCase;
}): DomainEventSubscriber<SendLateReturnReservationReminderPayload> {
  return {
    getName() {
      return 'send_late_returns_reminder';
    },
    subscribedTo() {
      return [SEND_LATE_RETURN_RESERVATION_REMINDER_EVENT_NAME];
    },

    async on(event) {
      await remindUserOfLateReturns(event.payload);
    },
  };
}
