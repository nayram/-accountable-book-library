import config from 'config';

import { pubSubClient } from '@libs/pub-sub';
import { calculateLateFees } from '@modules/reservations/applications';

const CALCULATE_LATE_FEES_TOPIC = config.get<string>('calculateLateFeesTopic');

function subscribe() {
  pubSubClient.subscribe({
    topic: CALCULATE_LATE_FEES_TOPIC,
    async handler(arg: unknown) {
      const { reservationId } = arg as { reservationId: string };
      await calculateLateFees({ reservationId });
    },
  });
}
