import { CalculateLateFeesUseCase } from '@modules/reservations/applications/calculate-late-fees';
import { DomainEventSubscriber } from '@modules/shared/core/domain/domain-events/domain-event-subscriber';
import {
  CALCULATE_RESERVATOIN_LATE_FEES,
  CalculateLateFeesPayload,
} from 'src/apps/workers/reservations/domain/domain-events/calculate-reservation-late-fees';

export function calculateLateFeesSubscriberBuilder({
  calculateLateFees,
}: {
  calculateLateFees: CalculateLateFeesUseCase;
}): DomainEventSubscriber<CalculateLateFeesPayload> {
  return {
    getName() {
      return 'calculate_late_fees';
    },

    subscribedTo() {
      return [CALCULATE_RESERVATOIN_LATE_FEES];
    },

    async on(event) {
      await calculateLateFees(event.payload);
    },
  };
}
