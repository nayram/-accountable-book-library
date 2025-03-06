import { createString } from '@modules/shared/core/domain/value-objects/string';

export type Name = string;

export function createName(value: string) {
  return createString(value, 'name');
}
