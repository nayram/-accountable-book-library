import { Server } from 'http';

import config from 'config';

import { start } from '@libs/resource-manager/resource-starter';
import { connectMongoDb } from '@resources/mongodb';
import redis from '@resources/redis';

import { subscribe } from './subscribe';
import server from './health';

const port = config.get<number>('lateFeeWorkerPort');

let app: Server;

const db = connectMongoDb();

const redisClient = redis();

async function onReady() {
  app = server.listen(port, () => {
    console.info(`Server running on port: ${port}`);
  });
  await subscribe();
}

async function onShutDown() {
  console.log('Shutting down worker to calculate-late-fees worker');

  if (app) {
    app.close();
    console.info('Server shutdown');
  }
}

start({ resources: [db, redisClient], onReady, onShutDown });
