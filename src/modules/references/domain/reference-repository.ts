import { Pagination } from '@modules/shared/core/domain/pagination';

import { SearchParams } from './search-params';
import { PaginatedResults } from './paginated-results';
import { Reference } from '../../shared/references/domain/reference/reference';
import { ExternalReferenceId } from '../../shared/references/domain/reference/external-reference-id';
import { ReferenceId } from '../../shared/references/domain/reference/reference-id';

export interface ReferenceRepository {
  save(reference: Reference): Promise<void>;
  exits(externalReferenceId: ExternalReferenceId): Promise<boolean>;
  findByExteranlReferenceId(externalReferenceId: ExternalReferenceId): Promise<Reference>;
  softDeleteById(id: ReferenceId): Promise<void>;
  find(pagination: Pagination, searchParams: SearchParams): Promise<PaginatedResults<Reference>>;
}
