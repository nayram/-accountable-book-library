import { createString } from '@modules/shared/core/domain/value-objects/string'

export type BookId = string

export function createBookId(value: string): BookId {
  return createString(value, 'book id')
}
