import { MongoMemoryReplSet } from 'mongodb-memory-server';
import config from 'config';

const mongoMemoryServerConfig = config.get<{ active: boolean; name: string }>('mongoMemoryServerConfig');

export = async function globalTeardown() {
  if (mongoMemoryServerConfig.active) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const instance: MongoMemoryReplSet = (global as any).__MONGOINSTANCE;
    await instance.stop();
  }
};
