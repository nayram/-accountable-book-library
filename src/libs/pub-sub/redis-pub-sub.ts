import { RedisClientType } from 'redis';

export interface RedisPubSub {
  publish({ topic, message }: { topic: string; message: Record<string, unknown> }): Promise<void>;
  subscribe({ topic, handler }: { topic: string; handler: (arg: unknown) => unknown }): Promise<void>;
}

export function redisPubSubBuilder({ client }: { client: RedisClientType }): RedisPubSub {
  return {
    async publish({ topic, message }) {
      await client.publish(topic, JSON.stringify(message));
    },
    async subscribe({ topic, handler }) {
      await client.subscribe(topic, handler);
    },
  };
}
