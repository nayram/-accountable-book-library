import { setup } from '@libs/event-bus/config';
import { eventBus } from '@libs/event-bus';

import { fetchUpcomingDueReservations } from './reservations/applications';

setup(eventBus);

fetchUpcomingDueReservations()
  .catch(console.error)
  .finally(() => {
    setTimeout(() => {
      process.exit();
    }, 1500);
  });
