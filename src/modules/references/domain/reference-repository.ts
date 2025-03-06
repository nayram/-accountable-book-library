import { Pagination } from '@modules/shared/core/domain/pagination';
import { Reference } from '@modules/shared/references/domain/reference';
import { ExternalReferenceId } from '@modules/shared/references/domain/external-reference-id';
import { ReferenceId } from '@modules/shared/references/domain/reference-id';
import { PaginatedResults } from '@modules/shared/core/domain/paginated-results';

import { SearchParams } from './search-params';

export interface ReferenceRepository {
  exits(externalReferenceId: ExternalReferenceId): Promise<boolean>;
  findByExteranlReferenceId(externalReferenceId: ExternalReferenceId): Promise<Reference>;
  softDeleteById(id: ReferenceId): Promise<void>;
  find(pagination: Pagination, searchParams: SearchParams): Promise<PaginatedResults<Reference>>;
}
