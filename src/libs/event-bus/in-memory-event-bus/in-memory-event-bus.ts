import { EventEmitter } from 'node:events';

import { EventBus } from '@modules/shared/core/domain/domain-events/event-bus';

export function inMemoryEventBus(): EventBus {
  let eventEmitter: EventEmitter;
  const processedSubscribers: string[] = [];

  init();

  function init() {
    initEventEmitter();
  }

  function initEventEmitter() {
    eventEmitter = new EventEmitter({ captureRejections: true });
    eventEmitter.on('error', console.error);
  }

  function getUniqueKey(subscriber: { getName(): string }, eventName: string) {
    return `${subscriber.getName()}:${eventName}`;
  }

  return {
    async publish(events) {
      await Promise.resolve(events.map((event) => eventEmitter.emit(event.name, event)));
    },

    async addSubscribers(subscribers) {
      await Promise.resolve(
        subscribers.forEach((subscriber) => {
          subscriber.subscribedTo().forEach((eventName) => {
            const uniqueKey = getUniqueKey(subscriber, eventName);

            if (processedSubscribers.includes(uniqueKey)) {
              return;
            }

            eventEmitter.on(eventName, subscriber.on.bind(eventName));
            processedSubscribers.push(uniqueKey);
          });
        }),
      );
    },
  };
}
