import { remindUserOfDueDates, remindUserOfLateReturns } from '@modules/reminders/application';

import { sendLateReturnsReminderSubscriberBuilder } from './send-late-returns-reminder';
import { sendReservationDueDateSubscriberBuilder } from './send-reservation-due-date-reminder';

export const sendLateReturnsReminderSubscriber = sendLateReturnsReminderSubscriberBuilder({
  remindUserOfLateReturns,
});

export const sendReservationDueDateSubscriber = sendReservationDueDateSubscriberBuilder({ remindUserOfDueDates });
