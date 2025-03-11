import config from 'config';
import { DomainEventSubscriber } from '@modules/shared/core/domain/domain-events/domain-event-subscriber';
import { EventBus } from '@modules/shared/core/domain/domain-events/event-bus';
import { calculateLateFeesSubscriber } from 'src/apps/subscribers/reservations';
import { sendLateReturnsReminderSubscriber, sendReservationDueDateSubscriber } from 'src/apps/subscribers/reminders';

const useEvents = config.get<boolean>('useEvents');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const subscribers: DomainEventSubscriber<Record<string, any>>[] = [
  calculateLateFeesSubscriber,
  sendLateReturnsReminderSubscriber,
  sendReservationDueDateSubscriber,
];

export async function setup(eventBus: EventBus) {
  await eventBus.addSubscribers(useEvents ? subscribers : []);
}
