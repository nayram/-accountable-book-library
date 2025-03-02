import { Uuid } from '@modules/shared/core/domain/value-objects/uuid';

export interface PaginatedResults<T> {
  data: T[];
  cursor: Uuid;
  totalCount: number;
}
