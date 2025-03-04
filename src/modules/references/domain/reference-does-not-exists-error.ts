import { ReferenceId } from './reference/reference-id';

export class ReferenceDoesNotExistsError extends Error {
  constructor(id: ReferenceId) {
    super(`Reference with id ${id} does not exists`);
    this.name = 'ReferenceDoesNotExistsError';
  }
}
