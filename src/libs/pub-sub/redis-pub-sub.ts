import { RedisConnector } from '@resources/redis';

export interface RedisPubSub {
  publish({ topic, message }: { topic: string; message: Record<string, unknown> }): Promise<void>;
  subscribe({ topic, handler }: { topic: string; handler: (arg: unknown) => unknown }): Promise<void>;
}

export function redisPubSubBuilder({ client: { getConnection } }: { client: RedisConnector }): RedisPubSub {
  return {
    async publish({ topic, message }) {
      await getConnection().publish(topic, JSON.stringify(message));
    },
    async subscribe({ topic, handler }) {
      await getConnection().subscribe(topic, handler);
    },
  };
}
