import { MongoMemoryReplSet } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
import config from 'config';

const mongoMemoryServerConfig = config.get<{ active: boolean; name: string }>('mongoMemoryServerConfig');

const db = config.get<{ url: string; name: string }>('db');

export = async function globalSetup() {
  if (mongoMemoryServerConfig.active) {
    const instance = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
    const uri = instance.getUri();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).__MONGOINSTANCE = instance;
    process.env.MONGO_URI = uri.slice(0, uri.lastIndexOf('/'));
  } else {
    process.env.MONGO_URI = db.url;
  }

  const conn = await mongoose.connect(`${process.env.MONGO_URI}/${db.name}`, {
    serverSelectionTimeoutMS: 5000,
  });
  if (conn.connection.db) {
    await conn.connection.db.dropDatabase();
  }
  await mongoose.disconnect();
};
