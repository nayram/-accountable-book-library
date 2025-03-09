import { UseCase } from '@modules/shared/core/application/use-case';
import { createPagination } from '@modules/shared/core/domain/pagination';
import { PaginatedResults } from '@modules/shared/core/domain/paginated-results';

import { createSearchParams } from '../domain/search-params';
import { ReservationRepository } from '../domain/reservation-repository';
import { Reservation } from '../domain/reservation/reservation';

export interface FindReservationsRequest {
  userId: string | null;
  referenceId: string | null;
  cursor: string | null;
  status: string | null;
  limit: number;
}

export type FindReservationsUseCase = UseCase<FindReservationsRequest, PaginatedResults<Reservation>>;

export function findReservationsBuilder({
  reservationRepository,
}: {
  reservationRepository: ReservationRepository;
}): FindReservationsUseCase {
  return async function findReservations(req: FindReservationsRequest) {
    const { cursor, limit, userId, status, referenceId } = req;
    return reservationRepository.find(
      createPagination({ limit, cursor, sortBy: 'reservedAt' }),
      createSearchParams({ referenceId, userId, status }),
    );
  };
}
