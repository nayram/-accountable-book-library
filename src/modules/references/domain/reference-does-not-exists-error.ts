import { ReferenceId } from '../../shared/references/domain/reference/reference-id';

export class ReferenceDoesNotExistsError extends Error {
  constructor(id: ReferenceId) {
    super(`Reference with id ${id} does not exists`);
    this.name = 'ReferenceDoesNotExistsError';
  }
}
