import { DomainEventSubscriber } from './domain-event-subscriber';
import { DomainEvent } from './domain-event';

export interface EventBus {
  addSubscribers(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    subscribers: DomainEventSubscriber<Record<string, any>>[]
  ): Promise<void>;
  publish<Payload>(events: DomainEvent<Payload>[]): Promise<void>;
}
