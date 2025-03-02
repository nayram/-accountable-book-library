import { Uuid } from '@modules/shared/core/domain/value-objects/uuid';

export class BookDoesNotExistsError extends Error {
  constructor(id: Uuid) {
    super(`Book with id ${id} does not exists`);
    this.name = 'BookDoesNotExistsError';
  }
}
