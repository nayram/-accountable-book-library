import { UseCase } from '@modules/shared/core/application/use-case';

import { ReservationRepository } from '../domain/reservation-repository';
import { Reservation } from '../domain/reservation/reservation';
import { createReservationId } from '../domain/reservation/reservation-id';

export interface FindReservationByIdRequest {
  id: string;
}

export type FindReservationByIdUseCase = UseCase<FindReservationByIdRequest, Reservation>;

export function findReservationByIdBuilder({
  reservationRepository,
}: {
  reservationRepository: ReservationRepository;
}): FindReservationByIdUseCase {
  return async function findReservationById({ id }: FindReservationByIdRequest) {
    return await reservationRepository.findById(createReservationId(id));
  };
}
