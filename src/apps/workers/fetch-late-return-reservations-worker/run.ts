import { start } from '@libs/resource-manager/resource-starter';
import redis from '@resources/redis';
import { setup } from '@libs/event-bus/config';
import { eventBus } from '@libs/event-bus';
import { connectMongoDb } from '@resources/mongodb';

import { fetchLateReturnReservations } from '../reservations/applications';

const db = connectMongoDb();

async function onReady() {
  setup(eventBus);
  fetchLateReturnReservations()
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
