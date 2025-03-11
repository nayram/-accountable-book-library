import { setup } from '@libs/event-bus/config';
import { eventBus } from '@libs/event-bus';
import { isConnected, connectMongoDb } from '@resources/mongodb';

import { fetchUpcomingDueReservations } from './reservations/applications';

const db = connectMongoDb();
async function runWorker() {
  if (!isConnected()) {
    await db.connect();
  }
  setup(eventBus);
  fetchUpcomingDueReservations()
    .catch(console.error)
    .finally(async () => {
      if (isConnected()) await db.disconnect();
      setTimeout(() => {
        process.exit();
      }, 1500);
    });
}

runWorker();
