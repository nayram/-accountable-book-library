import { setup } from '@libs/event-bus/config';
import { eventBus } from '@libs/event-bus';
import { isConnected } from '@libs/mongodb-utils';
import { connectMongoDb } from '@resources/mongodb';

import { fetchLateReturnReservations } from './reservations/applications';

const db = connectMongoDb();
async function runWorker() {
  if (!isConnected()) {
    await db.connect();
  }
  setup(eventBus);

  fetchLateReturnReservations()
    .catch(console.error)
    .finally(async () => {
      if (isConnected()) await db.disconnect();
    });
}

runWorker();
