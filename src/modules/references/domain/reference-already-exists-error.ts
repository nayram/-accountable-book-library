import { ExternalReferenceId } from '../../shared/references/domain/reference/external-reference-id';

export class ReferenceAlreadyExistsError extends Error {
  constructor(id: ExternalReferenceId) {
    super(`Reference with id, ${id} already exists`);
    this.name = 'ReferenceAlreadyExistsError';
  }
}
