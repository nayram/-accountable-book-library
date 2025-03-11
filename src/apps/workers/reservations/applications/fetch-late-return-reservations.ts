import { UserRepository } from '@modules/shared/users/domain/user-repository';
import { EventBus } from '@modules/shared/core/domain/domain-events/event-bus';
import { FindReferenceByIdUseCase } from '@modules/references/application/find-reference-by-id';

import { ReservationRepository } from '../domain/reservation-repository';
import { createSendLateReturnReminderDomainEvent } from '../domain/domain-events/send-late-return-reservation-reminder';
import { createCalculateReservatoinLateFeesDomainEvent } from '../domain/domain-events/calculate-reservation-late-fees';

export function fetchLateReturnReservationBuilder({
  userRepository,
  reservationRepository,
  findReferenceById,
  eventBus,
}: {
  userRepository: UserRepository;
  reservationRepository: ReservationRepository;
  findReferenceById: FindReferenceByIdUseCase;
  eventBus: EventBus;
}) {
  return async function fetchLateReturnReservation() {
    const reservationStream = reservationRepository.streamLateReturnReservations();
    for await (const reservation of reservationStream) {
      try {
        console.info(`processing reservation with id ${reservation.id}`);
        const { name, email } = await userRepository.findById(reservation.userId);
        const { title } = await findReferenceById({ id: reservation.referenceId });
        console.info(`publishing SendLateReturnReminderDomainEvent for reservation: ${reservation.id}`);
        await eventBus.publish([createSendLateReturnReminderDomainEvent({ name, email, referenceTitle: title })]);

        await eventBus.publish([createCalculateReservatoinLateFeesDomainEvent({ reservationId: reservation.id })]);
        console.info(
          `event SendLateReturnReminderDomainEvent published successfully for reservation: ${reservation.id}`,
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error(error.message);
      }
    }
  };
}
