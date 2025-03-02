import { uuidV4Generator } from '@modules/shared/core/infrastructure/uuid-v4-generator';

import { bookRepository } from '../infrastructure';

import { createCatalogBuilder } from './create-catalog';
import { findCatalogByBookIdBuilder } from './find-catalog-by-book-id';
import { deleteCatalogByBookIdBuilder } from './delete-catalog-by-book-id';

export const createCatalog = createCatalogBuilder({
  bookRepository,
  uuidGenerator: uuidV4Generator,
});
export const findCatalogByBookId = findCatalogByBookIdBuilder({ bookRepository });
export const deleteCatalogByBookId = deleteCatalogByBookIdBuilder({ bookRepository });
