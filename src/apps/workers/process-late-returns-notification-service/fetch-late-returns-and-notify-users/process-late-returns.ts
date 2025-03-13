import { UserRepository } from '@modules/shared/users/domain/user-repository';
import { FindReferenceByIdUseCase } from '@modules/references/application/find-reference-by-id';
import { ReservationRepository } from '@modules/reservations/domain/reservation-repository';
import { CalculateLateFeesUseCase } from '@modules/reservations/applications/calculate-late-fees';
import { createLateReturnReminder } from '@modules/shared/reminders/domain/reminder/reminder';
import { QUEUE_EMAIL_SERVICE_TOPIC, QueueService } from '@modules/shared/core/domain/queue-service';

export function processLateReturnsBuilder({
  userRepository,
  reservationRepository,
  findReferenceById,
  calculateLateFees,
  queueService,
}: {
  userRepository: UserRepository;
  reservationRepository: ReservationRepository;
  findReferenceById: FindReferenceByIdUseCase;
  calculateLateFees: CalculateLateFeesUseCase;
  queueService: QueueService;
}) {
  return async function processLateReturns() {
    const reservationStream = reservationRepository.streamLateReturnReservations();
    for await (const reservation of reservationStream) {
      try {
        console.info(`processing reservation with id ${reservation.id}`);

        await calculateLateFees({ reservationId: reservation.id });

        const { name, email } = await userRepository.findById(reservation.userId);
        const { title } = await findReferenceById({ id: reservation.referenceId });
        const reminder = createLateReturnReminder({ email, name, referenceTitle: title });
        await queueService.enqueue(QUEUE_EMAIL_SERVICE_TOPIC, reminder);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error(error.message);
      }
    }
  };
}
