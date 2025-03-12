import { EventEmitter } from 'events';

import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import config from 'config';

const mongoMemoryServerConfig = config.get<{ active: boolean; name: string }>('mongoMemoryServerConfig');
const db = config.get<{ url: string; name: string }>('db');

let mongoServer: MongoMemoryReplSet | null = null;
export interface MongooseConnector extends EventEmitter {
  name: string;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  dropDatabase(): Promise<void>;
  dropCollection(collectionName: string): Promise<void>;
}

const mongooseConnector = (dbUrl: string): MongooseConnector => {
  const connections = Object.create(EventEmitter.prototype);
  EventEmitter.call(connections);
  const name = 'MongooseConnection';
  mongoose.connection
    .on('open', () => {
      const msg = 'Connected to mongodb successfully';
      connections.emit('connected', {
        instance: mongoose.connection,
        name,
      });
      console.info(msg);
    })
    .on('error', (err) => {
      console.error(err);
      console.error('err:connection:reason', err.reason);
    })
    .on('close', () => {
      const msg = 'Disconnected mongodb successfully';
      console.info(msg);
      connections.emit('disconnected');
    });

  return Object.assign(connections, {
    name: 'MongooseConnection',
    connect: async () => {
      let url = dbUrl;
      if (mongoMemoryServerConfig.active) {
        mongoServer = new MongoMemoryReplSet({
          replSet: {
            name: mongoMemoryServerConfig.name,
            dbName: db.name,
          },
        });
        await mongoServer.start();
        url = mongoServer.getUri(db.name);
      }

      await mongoose.connect(url);
    },
    disconnect: async () => {
      if (mongoMemoryServerConfig.active && mongoServer) {
        await mongoServer.stop();
        mongoServer = null;
      }

      await mongoose.connection.close();
    },
    dropDatabase: async () => {
      await mongoose.connection.dropDatabase();
    },
    dropCollection: async (collectionName: string) => {
      return new Promise((resolve, reject) => {
        if (!mongoose.connection.collections[collectionName]) {
          return resolve(collectionName);
        }
        mongoose.connection.collections[collectionName]
          .drop()
          .then(() => resolve(collectionName))
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .catch((err: any) => {
            if (err.message !== 'ns not found') return reject(err);
            return resolve(collectionName);
          });
      });
    },
  });
};

export const getDBConnector = (dbUrl: string) => mongooseConnector(dbUrl);
