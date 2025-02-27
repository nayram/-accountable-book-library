import { createString } from '@modules/shared/core/domain/value-objects/string'

export type Publisher = string

export function createPublisher(value: string): Publisher {
  return createString(value, 'publisher')
}
