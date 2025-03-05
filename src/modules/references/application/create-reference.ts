import { UseCase } from '@modules/shared/core/application/use-case';
import { UuidGenerator } from '@modules/shared/core/domain/uuid-generator';
import { create, Reference } from '@modules/shared/references/domain/reference';
import { create as createBook, defaultNumberOfBooks } from '@modules/shared/books/domain/book';
// eslint-disable-next-line max-len
import { ReferenceBookRepository } from '@modules/shared/core/domain/reference-book-repository';

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
  referenceBookRepository,
  referenceRepository,
  uuidGenerator,
}: {
  referenceBookRepository: ReferenceBookRepository;
  referenceRepository: ReferenceRepository;
  uuidGenerator: UuidGenerator;
}): CreateReferenceUseCase {
  return async function createReference(request: CreateReferenceRequest) {
    const id = uuidGenerator.generate();
    const reference = create({ ...request, id });
    const books = Array.from({ length: defaultNumberOfBooks }, () =>
      createBook({ id: uuidGenerator.generate(), referenceId: id }),
    );

    const referenceExists = await referenceRepository.exits(reference.externalReferenceId);
    if (referenceExists) {
      throw new ReferenceAlreadyExistsError(reference.externalReferenceId);
    }

    await referenceBookRepository.save(reference, books);

    return reference;
  };
}
