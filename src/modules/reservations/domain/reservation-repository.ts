import { Pagination } from '@modules/shared/core/domain/pagination';
import { PaginatedResults } from '@modules/shared/core/domain/paginated-results';

import { Reservation } from './reservation/reservation';
import { SearchParams } from './search-params';
import { ReservationId } from './reservation/reservation-id';

export interface ReservationRepository {
  find(pagination: Pagination, searchParams: SearchParams): Promise<PaginatedResults<Reservation>>;
  findBySearchParams(searchParams: SearchParams): Promise<Reservation[]>;
  findById(id: ReservationId): Promise<Reservation>;
}
