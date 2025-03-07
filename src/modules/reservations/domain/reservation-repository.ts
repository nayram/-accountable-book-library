import { Pagination } from '@modules/shared/core/domain/pagination';
import { PaginatedResults } from '@modules/shared/core/domain/paginated-results';

import { Reservation } from './reservation/reservation';
import { SearchParams } from './search-params';

export interface ReservationRepository {
  find(pagination: Pagination, searchParams: SearchParams): Promise<PaginatedResults<Reservation>>;
}
