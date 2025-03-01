import { EventEmitter } from 'events';

import mongoose from 'mongoose';

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
      await mongoose.connect(dbUrl);
    },
    disconnect: async () => {
      await mongoose.connection.close();
    },
    dropDatabase: async () => {
      await mongoose.connection.dropDatabase();
    },
    dropCollection: async (collectionName: string) => {
      await mongoose.connection.dropCollection(collectionName);
    },
  });
};

export const getDBConnector = (dbUrl: string) => mongooseConnector(dbUrl);
