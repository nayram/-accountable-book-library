import { start } from '@libs/resource-manager/resource-starter';
import redis from '@resources/redis';
import { connectMongoDb } from '@resources/mongodb';

import { processLateReturns } from './fetch-late-returns-and-notify-users';

const db = connectMongoDb();

async function onReady() {
  processLateReturns()
    .catch(console.error)
    .finally(() => {
      console.log('done');
      process.emit('SIGTERM');
    });
}

async function onShutDown() {
  console.log('worker shut down');
}

start({ resources: [db, redis()], onReady, onShutDown });
