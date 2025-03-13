import { start } from '@libs/resource-manager/resource-starter';
import { connectMongoDb } from '@resources/mongodb';

import { processUpcomingReservations } from './fetch-up-coming-reservations-and-notify-users';

const db = connectMongoDb();

async function onReady() {
  processUpcomingReservations()
    .catch(console.error)
    .finally(() => {
      process.emit('SIGTERM');
    });
}

async function onShutDown() {
  console.log('worker shut down');
}

start({ resources: [db], onReady, onShutDown });
