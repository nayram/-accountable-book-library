import { createUserId } from '@modules/shared/users/domain/user/user-id';
import { UseCase } from '@modules/shared/core/application/use-case';

import { ReservationRepository } from '../domain/reservation-repository';
import { Reservation } from '../domain/reservation/reservation';

export interface FindReservationsByUserIdRequest {
  userId: string;
}

export type FindReservationsByUserIdUseCase = UseCase<FindReservationsByUserIdRequest, Reservation[]>;

export function findReservationsByUserIdBuilder({
  reservationRepository,
}: {
  reservationRepository: ReservationRepository;
}): FindReservationsByUserIdUseCase {
  return async function findReservationsByUserId({ userId }: FindReservationsByUserIdRequest) {
    return await reservationRepository.findBySearchParams({ userId: createUserId(userId) });
  };
}
