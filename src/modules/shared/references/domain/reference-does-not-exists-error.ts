import { ReferenceId } from './reference-id';

export class ReferenceDoesNotExistsError extends Error {
  constructor(id: ReferenceId) {
    super(`reference with id ${id} does not exist`);
    this.name = 'ReferenceDoesNotExistsError';
  }
}
