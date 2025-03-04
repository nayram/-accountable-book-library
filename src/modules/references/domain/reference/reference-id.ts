import { createUuid, Uuid } from '@modules/shared/core/domain/value-objects/uuid';

export type ReferenceId = Uuid;

export function createReferenceId(value: string): ReferenceId {
  return createUuid(value, 'referenceId');
}
