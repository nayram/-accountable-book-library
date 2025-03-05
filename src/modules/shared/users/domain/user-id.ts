import { createUuid, Uuid } from '@modules/shared/core/domain/value-objects/uuid';

export type UserId = Uuid;

export function createUserId(value: string) {
  return createUuid(value, 'userId');
}
