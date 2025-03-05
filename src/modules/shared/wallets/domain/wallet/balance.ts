import { createInteger, Integer } from '@modules/shared/core/domain/value-objects/integer';

export type Balance = Integer;

export function createBalance(value: number): Balance {
  return createInteger(value, 'balance');
}
