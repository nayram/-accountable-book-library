import config from 'config';

import { RedisPubSub } from '@libs/pub-sub/redis-pub-sub';
import { DomainEventSubscriber } from '@modules/shared/core/domain/domain-events/domain-event-subscriber';
import {
  CALCULATE_RESERVATOIN_LATE_FEES,
  CalculateLateFeesPayload,
} from 'src/apps/workers/reservations/domain/domain-events/calculate-reservation-late-fees';

const CALCULATE_LATE_FEES_TOPIC = config.get<string>('calculateLateFeesTopic');

export function calculateLateFeesSubscriberBuilder({
  pubSubClient,
}: {
  pubSubClient: RedisPubSub;
}): DomainEventSubscriber<CalculateLateFeesPayload> {
  return {
    getName() {
      return 'calculate_late_fees';
    },

    subscribedTo() {
      return [CALCULATE_RESERVATOIN_LATE_FEES];
    },

    async on({ payload }) {
      console.log('calculate late fees');
      await pubSubClient.publish({
        topic: CALCULATE_LATE_FEES_TOPIC,
        message: payload as unknown as Record<string, unknown>,
      });
    },
  };
}
