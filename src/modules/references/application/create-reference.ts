import { UseCase } from '@modules/shared/core/application/use-case';
import { UuidGenerator } from '@modules/shared/core/domain/uuid-generator';
import { create, Reference } from '@modules/shared/references/domain/reference';

import { ReferenceAlreadyExistsError } from '../domain/reference-already-exists-error';
import { ReferenceRepository } from '../domain/reference-repository';

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
    const id = uuidGenerator.generate();
    const reference = create({ ...request, id });

    const referenceExists = await referenceRepository.exits(reference.externalReferenceId);
    if (referenceExists) {
      throw new ReferenceAlreadyExistsError(reference.externalReferenceId);
    }

    await referenceRepository.save(reference);

    return reference;
  };
}
