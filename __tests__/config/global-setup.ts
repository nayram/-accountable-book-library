import { MongoMemoryReplSet } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
import config from 'config';

const mongoMemoryServerConfig = config.get<{ active: boolean; name: string }>('mongoMemoryServerConfig');

const db = config.get<{ url: string; name: string }>('db');

export = async function globalSetup() {
  if (mongoMemoryServerConfig.active) {
    // Config to decide if an mongodb-memory-server instance should be used
    // it's needed in global space, because we don't want to create a new instance every test-suite
    const instance = await MongoMemoryReplSet.create();
    const uri = instance.getUri();
    (global as any).__MONGOINSTANCE = instance;
    process.env.MONGO_URI = uri.slice(0, uri.lastIndexOf('/'));
  } else {
    process.env.MONGO_URI = db.url;
  }

  // The following is to make sure the database is clean before a test suite starts
  const conn = await mongoose.connect(`${process.env.MONGO_URI}/${db.name}`);
  if (conn.connection.db) {
    await conn.connection.db.dropDatabase();
  }
  await mongoose.disconnect();
};
