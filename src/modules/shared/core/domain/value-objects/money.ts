import { createPositiveInt, PositiveInt } from './positive-int';

export type Money = PositiveInt;

export function createMoney(value: PositiveInt, fieldName: string) {
  return createPositiveInt(value, fieldName);
}
