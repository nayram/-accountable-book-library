import { Pagination } from '@modules/shared/core/domain/pagination';

import { referenceModel } from '@modules/shared/references/infrastructure/reference-model';

export function mapSortByFieldToModelField(sortByField: Pagination['sortBy']): string {
  const fieldMap: Record<Pagination['sortBy'], string> = {
    id: '_id',
    createdAt: 'created_at',
    reservedAt: 'reserved_at',
  };

  return fieldMap[sortByField];
}

export async function hasTextIndex(): Promise<boolean> {
  try {
    const indexes = await referenceModel.collection.indexes();
    return indexes.some((index) => {
      return index.key && typeof index.key === 'object' && 'title' in index.key && index.key.title === 'text';
    });
  } catch (error) {
    console.error('Error checking for text index:', error);
    return false;
  }
}
