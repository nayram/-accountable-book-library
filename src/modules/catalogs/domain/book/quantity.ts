import { createPositiveInt } from '@modules/shared/core/domain/value-objects/positive-int'

export type Quantity = number

export function createQuantity(value: number): Quantity {
  return createPositiveInt(value, 'quantity')
}
