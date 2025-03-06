import { ReferenceDoesNotExistsError } from '../domain/reference-does-not-exists-error';
import { ReferenceRepository } from '../domain/reference-repository';

import { ReferenceModel } from './reference-model';

export function referenceRepositoryBuilder({ model }: { model: ReferenceModel }): ReferenceRepository {
  return {
    async exists(id) {
      const reference = await model.findById(id);
      if (!reference || reference.soft_delete) {
        throw new ReferenceDoesNotExistsError(id);
      }
    },
  };
}
