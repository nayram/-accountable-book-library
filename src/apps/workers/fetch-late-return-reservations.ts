import { setup } from '@libs/event-bus/config';
import { eventBus } from '@libs/event-bus';

import { fetchLateReturnReservations } from './reservations/applications';

setup(eventBus);

fetchLateReturnReservations()
  .catch(console.error)
  .finally(() => {
    setTimeout(() => {
      process.exit();
    }, 1500);
  });
