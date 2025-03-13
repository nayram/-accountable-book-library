import { EventEmitter } from 'events';

import config from 'config';
import { RedisClientType, createClient } from 'redis';
import { Queue, Worker } from 'bullmq';

const redis = config.get<{ host: string; port: number }>('redis');

let client: RedisClientType;

export type RedisQueue = Queue;
export type RedisConsumer = Worker;

export interface RedisConnector extends EventEmitter {
  name: string;
  connect(): Promise<void>;
  getConnection(): RedisClientType;
  createQueue(topic: string): RedisQueue;
  createConsumer(topic: string, handler: (args: unknown) => Promise<void>): RedisConsumer;
  disconnect(): Promise<void>;
}

/**
 * Creates a Redis connector
 * @param {Object} options Configuration options
 * @param {string} options.url Redis connection URL
 * @returns {RedisConnector} A Redis connector object
 */
function createRedisConnector(
  { host, port }: { host: string; port: number } = { host: redis.host, port: redis.port },
): RedisConnector {
  const emitter = new EventEmitter();
  const name = 'RedisConnection';

  const connector = {
    name,
    async connect() {
      if (client) return;
      client = createClient({ url: `redis://${host}:${port}` });

      await client
        .on('error', (error) => {
          console.error(error);
        })
        .on('ready', () => {
          console.info('Connected to redis successfully');
          emitter.emit('connected', {
            instance: client,
            name,
          });
        })
        .on('end', () => {
          console.info('Disconnected redis successfully');
        })
        .connect();
    },

    getConnection(): RedisClientType {
      if (!client) {
        throw new Error('No client connection');
      }
      return client;
    },

    async disconnect(): Promise<void> {
      if (client) {
        await client.quit();
        emitter.emit('disconnected', { name });
      }
    },
    createQueue(topic: string) {
      return new Queue(topic, { connection: { host, port } });
    },
    createConsumer(topic: string, handler: (args: unknown) => Promise<void>) {
      return new Worker(topic, handler, { connection: { host, port } });
    },
  };

  return Object.assign(emitter, connector);
}

export default function () {
  return createRedisConnector();
}
