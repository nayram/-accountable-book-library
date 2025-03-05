import { UseCase } from '@modules/shared/core/application/use-case';
import { createReferenceId } from '@modules/shared/references/domain/reference-id';

import { ReferenceRepository } from '../domain/reference-repository';

export interface DeleteReferenceByIdRequest {
  id: string;
}

export type DeleteReferenceByIdUseCase = UseCase<DeleteReferenceByIdRequest, void>;

export function deleteReferenceByIdBuilder({
  referenceRepository,
}: {
  referenceRepository: ReferenceRepository;
}): DeleteReferenceByIdUseCase {
  return async function deleteReferenceById({ id }: DeleteReferenceByIdRequest) {
    await referenceRepository.softDeleteById(createReferenceId(id));
  };
}
