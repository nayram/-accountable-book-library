import { UserRepository } from '@modules/shared/users/domain/user-repository';
import { FindReferenceByIdUseCase } from '@modules/references/application/find-reference-by-id';
import { ReservationRepository } from '@modules/reservations/domain/reservation-repository';
import { createDueDateReminder } from '@modules/shared/reminders/domain/reminder/reminder';
import { QUEUE_EMAIL_SERVICE_TOPIC, QueueService } from '@modules/shared/core/domain/queue-service';

export function processUpcomingReservationsBuilder({
  userRepository,
  reservationRepository,
  findReferenceById,
  queueService,
}: {
  userRepository: UserRepository;
  reservationRepository: ReservationRepository;
  findReferenceById: FindReferenceByIdUseCase;
  queueService: QueueService;
}) {
  return async function processUpcomingReservations() {
    console.log('fetching data that are up coming ');
    const reservationStream = reservationRepository.streamUpcomingDueDateReservations();
    for await (const reservation of reservationStream) {
      console.info(`processing reservation with id ${reservation.id}`);
      try {
        const { name, email } = await userRepository.findById(reservation.userId);
        const { title } = await findReferenceById({ id: reservation.referenceId });

        const reminder = createDueDateReminder({ email, name, referenceTitle: title });

        await queueService.enqueue(QUEUE_EMAIL_SERVICE_TOPIC, reminder);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error(error.message);
      }
    }
  };
}
