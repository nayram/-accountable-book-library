import { FieldValidationError } from './field-validation-error';
import { createPositiveInt } from './value-objects/positive-int';
import { createUuid, Uuid } from './value-objects/uuid';

export interface Pagination {
  cursor: Uuid | null;
  limit: number;
  sortBy: 'id' | 'createdAt' | 'reservedAt';
  sortOrder: 'asc' | 'desc';
}

export function createPagination({
  cursor,
  limit,
  sortBy,
}: {
  cursor: string | null;
  limit: number;
  sortBy: Pagination['sortBy'];
}): Pagination {
  return {
    cursor: cursor ? createUuid(cursor, 'cursor') : null,
    limit: createLimit(limit),
    sortBy,
    sortOrder: 'desc',
  };
}

function createLimit(limit: number): number {
  if (!(createPositiveInt(limit, 'limit') > 0)) {
    throw new FieldValidationError(`limit must be greater than 0`);
  }

  return limit;
}
