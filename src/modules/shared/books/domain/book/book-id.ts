import { createUuid } from '@modules/shared/core/domain/value-objects/uuid';

export type BookId = string;

export function createBookId(value: string) {
  return createUuid(value, 'book id');
}
