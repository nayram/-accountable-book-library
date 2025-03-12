import EventEmitter from 'events';

import redis, { RedisClientType } from 'redis';

export interface RedisConnector extends EventEmitter {
  name: string;
  getConnection(): RedisClientType;
  disconnect(): Promise<void>;
}

function redisClientBuilder({ url }: { url: string }): RedisConnector {
  const connections = Object.create(EventEmitter.prototype);
  EventEmitter.call(connections);
  const name = 'RedisConnection';
  const client = redis.createClient({ url });

  client
    .on('error', (error) => {
      console.error(error);
    })
    .on('ready', () => {
      const message = 'Connected to redis successfully';
      connections.emit('connected', {
        instance: client,
        name,
      });
      console.info(message);
    })
    .on('end', () => {
      const msg = 'Disconnected redis successfully';
      console.info(msg);
    });

  return Object.assign(connections, {
    async getConnection() {
      if (client) {
        return client;
      }
      throw new Error('No client connection');
    },
    async disconnect() {
      await client.quit();
      connections.emit('disconnected');
    },
    name,
  });
}

export const redisConnector = (url: string) => redisClientBuilder({ url });
