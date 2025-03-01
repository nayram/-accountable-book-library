import { createUuid, Uuid } from '@modules/shared/core/domain/value-objects/uuid';

export type BookId = Uuid;

export function createBookId(value: string): BookId {
  return createUuid(value, 'bookId');
}
