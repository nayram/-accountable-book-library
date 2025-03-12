import { UserRepository } from '@modules/shared/users/domain/user-repository';
import { EventBus } from '@modules/shared/core/domain/domain-events/event-bus';
import { FindReferenceByIdUseCase } from '@modules/references/application/find-reference-by-id';

import { ReservationRepository } from '../domain/reservation-repository';
// eslint-disable-next-line max-len
import { createSendReservationDueDateReminderDomainEvent } from '../domain/domain-events/send-reservation-due-date-reminder';

export function fetchUpcomingDueReservationsBuilder({
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
  return async function fetchUpcomingDueReservations() {
    console.log('fetching data that are up coming ');
    const reservationStream = reservationRepository.streamUpcomingDueDateReservations();
    for await (const reservation of reservationStream) {
      console.info(`processing reservation with id ${reservation.id}`);
      try {
        const { name, email } = await userRepository.findById(reservation.userId);
        const { title } = await findReferenceById({ id: reservation.referenceId });
        console.info(`publishing SendReservationDueDateReminderDomainEvent for reservation: ${reservation.id}`);
        await eventBus.publish([
          createSendReservationDueDateReminderDomainEvent({ name, email, referenceTitle: title }),
        ]);
        console.info(`event published successfully for reservation: ${reservation.id}`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error(error.message);
      }
    }
  };
}
