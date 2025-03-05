import { UseCase } from '@modules/shared/core/application/use-case';
import { Reference } from '@modules/shared/references/domain/reference';
import { createExternalReferenceId } from '@modules/shared/references/domain/external-reference-id';

import { ReferenceRepository } from '../domain/reference-repository';

export interface FindReferenceByExternalReferenceIdRequest {
  externalReferenceId: string;
}

export type FindReferenceByExternalReferenceIdUseCase = UseCase<FindReferenceByExternalReferenceIdRequest, Reference>;

export function findReferenceByExternalReferenceIdBuilder({
  referenceRepository,
}: {
  referenceRepository: ReferenceRepository;
}): FindReferenceByExternalReferenceIdUseCase {
  return async function findReferenceByExternalReferenceId({
    externalReferenceId,
  }: FindReferenceByExternalReferenceIdRequest) {
    return referenceRepository.findByExteranlReferenceId(createExternalReferenceId(externalReferenceId));
  };
}
