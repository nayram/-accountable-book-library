import { createUuid, Uuid } from '@modules/shared/core/domain/value-objects/uuid';

export type BorrowId = Uuid;

export function createBorrowId(value: string): BorrowId {
  return createUuid(value, 'borrowId');
}
