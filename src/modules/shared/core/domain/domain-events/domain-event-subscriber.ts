import { DomainEvent } from './domain-event';

export interface DomainEventSubscriber<Payload> {
  getName(): string;
  subscribedTo(): string[];
  on(event: DomainEvent<Payload>): Promise<void>;
}
