import { UseCase } from '@modules/shared/core/application/use-case';

import { Reference } from '../../shared/references/domain/reference/reference';
import { ReferenceRepository } from '../domain/reference-repository';
import { createExternalReferenceId } from '../../shared/references/domain/reference/external-reference-id';

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
