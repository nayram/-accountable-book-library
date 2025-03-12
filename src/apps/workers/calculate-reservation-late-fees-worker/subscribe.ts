import config from 'config';

import { pubSubClient } from '@libs/pub-sub';
import { calculateLateFees } from '@modules/reservations/applications';

const CALCULATE_LATE_FEES_TOPIC = config.get<string>('calculateLateFeesTopic');

export async function subscribe() {
  await pubSubClient.subscribe({
    topic: CALCULATE_LATE_FEES_TOPIC,
    async handler(arg: unknown) {
      console.log('processing reservations', arg);
      const { reservationId } = JSON.parse(arg as string);

      try {
        if (reservationId) {
          console.log('processing reservations', reservationId);
          await calculateLateFees({ reservationId });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error(error.message);
      }
    },
  });
}
