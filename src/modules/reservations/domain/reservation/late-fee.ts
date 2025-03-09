import { createMoney, Money } from '@modules/shared/core/domain/value-objects/money';

export type LateFee = Money;

export function createLateFee(value: number): LateFee {
  return createMoney(value, 'lateFee');
}
