import { Pagination } from '@modules/shared/core/domain/pagination';

import { SearchParams } from './search-params';
import { PaginatedResults } from './paginated-results';
import { Reference } from './reference/reference';
import { ExternalReferenceId } from './reference/external-reference-id';
import { ReferenceId } from './reference/reference-id';

export interface ReferenceRepository {
  save(reference: Reference): Promise<void>;
  exits(externalReferenceId: ExternalReferenceId): Promise<boolean>;
  findById(id: ReferenceId): Promise<Reference>;
  softDeleteById(id: ReferenceId): Promise<void>;
  find(pagination: Pagination, searchParams: SearchParams): Promise<PaginatedResults<Reference>>;
}
