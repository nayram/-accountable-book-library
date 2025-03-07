import { createEnumValue } from '@modules/shared/core/domain/enum';

export enum BookStatus {
  Available = 'available',
  Reserved = 'reserved',
  Borrowed = 'borrowed',
}

export function createBookStatus(value: string): BookStatus {
  return createEnumValue<BookStatus>(value, BookStatus, 'book status');
}
