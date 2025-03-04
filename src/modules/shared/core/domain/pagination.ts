import { FieldValidationError } from './field-validation-error';
import { createPositiveInt } from './value-objects/positive-int';
import { createUuid, Uuid } from './value-objects/uuid';

export interface Pagination {
  cursor: Uuid | null;
  limit: number;
  sortBy: 'id' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}

export function createPagination({ cursor, limit }: { cursor: string | null; limit: number }): Pagination {
  return {
    cursor: cursor ? createUuid(cursor, 'cursor') : null,
    limit: createLimit(limit),
    sortBy: 'createdAt',
    sortOrder: 'desc',
  };
}

function createLimit(limit: number): number {
  if (!(createPositiveInt(limit, 'limit') > 0)) {
    throw new FieldValidationError(`limit must be greater than 0`);
  }

  return limit;
}
