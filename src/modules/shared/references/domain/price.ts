import { createPositiveInt } from '@modules/shared/core/domain/value-objects/positive-int';

export type Price = number;

export function createPrice(value: number): Price {
  return createPositiveInt(value, 'price');
}
