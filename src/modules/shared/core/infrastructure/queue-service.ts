import { RedisConnector, RedisQueue } from '@resources/redis';

import { QueueService } from '../domain/queue-service';
import { QueueDoesNotExistError } from '../domain/queue-does-not-exist';

export function queueServiceBuilder({ redis }: { redis: RedisConnector }): QueueService {
  let queue: RedisQueue;
  return {
    create(topic) {
      queue = redis.createQueue(topic);
      return this;
    },
    async enqueue(topic, payload) {
      if (!queue) {
        throw new QueueDoesNotExistError(topic);
      }
      await queue.add(topic, payload);
    },
    consume(topic, handler) {
      return redis.createConsumer(topic, handler);
    },
  };
}
