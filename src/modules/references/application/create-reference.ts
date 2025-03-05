import { UseCase } from '@modules/shared/core/application/use-case';
import { UuidGenerator } from '@modules/shared/core/domain/uuid-generator';

import { ReferenceRepository } from '../domain/reference-repository';
import { create, Reference } from '../../shared/references/domain/reference/reference';
import { ReferenceAlreadyExistsError } from '../domain/reference-already-exists-error';

export interface CreateReferenceRequest {
  externalReferenceId: string;
  title: string;
  author: string;
  publicationYear: number;
  publisher: string;
  price: number;
}

export type CreateReferenceUseCase = UseCase<CreateReferenceRequest, Reference>;

export function createReferenceBuilder({
  referenceRepository,
  uuidGenerator,
}: {
  referenceRepository: ReferenceRepository;
  uuidGenerator: UuidGenerator;
}): CreateReferenceUseCase {
  return async function createReference(request: CreateReferenceRequest) {
    const reference = create({ ...request, id: uuidGenerator.generate() });

    const referenceExists = await referenceRepository.exits(reference.externalReferenceId);
    if (referenceExists) {
      throw new ReferenceAlreadyExistsError(reference.externalReferenceId);
    }

    await referenceRepository.save(reference);
    return reference;
  };
}
