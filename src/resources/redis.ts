import { EventEmitter } from 'events';

import config from 'config';
import { RedisClientType, createClient } from 'redis';

const redisUrl = config.get<string>('redisUrl');

let client: RedisClientType;

export interface RedisConnector extends EventEmitter {
  name: string;
  connect(): Promise<void>;
  getConnection(): RedisClientType;
  disconnect(): Promise<void>;
}

/**
 * Creates a Redis connector
 * @param {Object} options Configuration options
 * @param {string} options.url Redis connection URL
 * @returns {RedisConnector} A Redis connector object
 */
function createRedisConnector({ url = redisUrl }: { url?: string } = {}): RedisConnector {
  const emitter = new EventEmitter();
  const name = 'RedisConnection';

  const connector = {
    name,
    async connect() {
      if (client) return;
      client = createClient({ url });

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
  };

  return Object.assign(emitter, connector);
}

export default function () {
  return createRedisConnector();
}
