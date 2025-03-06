import { UseCase } from '@modules/shared/core/application/use-case';
import { createPagination } from '@modules/shared/core/domain/pagination';
import { Reference } from '@modules/shared/references/domain/reference';
import { PaginatedResults } from '@modules/shared/core/domain/paginated-results';

import { createSearchParams } from '../domain/search-params';
import { ReferenceRepository } from '../domain/reference-repository';

export interface FindReferencesRequest {
  author: string | null;
  publicationYear: number | null;
  title: string | null;
  cursor: string | null;
  limit: number;
}

export type FindReferencesUseCase = UseCase<FindReferencesRequest, PaginatedResults<Reference>>;

export function findReferencesBuilder({
  referenceRepository,
}: {
  referenceRepository: ReferenceRepository;
}): FindReferencesUseCase {
  return async function findReferences(req: FindReferencesRequest) {
    const { cursor, limit, author, publicationYear, title } = req;
    return referenceRepository.find(
      createPagination({ limit, cursor }),
      createSearchParams({ author, publicationYear, title }),
    );
  };
}
