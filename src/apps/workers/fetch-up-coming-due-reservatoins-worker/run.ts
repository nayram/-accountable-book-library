import { start } from '@libs/resource-manager/resource-starter';
import { setup } from '@libs/event-bus/config';
import { eventBus } from '@libs/event-bus';
import { connectMongoDb } from '@resources/mongodb';

import { fetchUpcomingDueReservations } from '../reservations/applications';

const db = connectMongoDb();

async function onReady() {
  setup(eventBus);
  fetchUpcomingDueReservations()
    .catch(console.error)
    .finally(() => {
      process.emit('SIGTERM');
    });
}

async function onShutDown() {
  console.log('worker shut down');
}

start({ resources: [db], onReady, onShutDown });
