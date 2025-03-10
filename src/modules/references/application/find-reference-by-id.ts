import { UseCase } from '@modules/shared/core/application/use-case';
import { Reference } from '@modules/shared/references/domain/reference';
import { createReferenceId } from '@modules/shared/references/domain/reference-id';

import { ReferenceRepository } from '../domain/reference-repository';

export interface FindReferenceByIdRequest {
  id: string;
}

export type FindReferenceByIdUseCase = UseCase<FindReferenceByIdRequest, Reference>;

export function findReferenceByIdBuilder({
  referenceRepository,
}: {
  referenceRepository: ReferenceRepository;
}): FindReferenceByIdUseCase {
  return async function findReferenceById({ id }: FindReferenceByIdRequest) {
    return referenceRepository.findById(createReferenceId(id));
  };
}
