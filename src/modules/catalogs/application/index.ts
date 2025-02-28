import { uuidV4Generator } from '@modules/shared/core/infrastructure/uuid-v4-generator'
import { createCatalogBuilder } from './create-catalog'
import { bookRepository } from '../infrastructure'

export const createCatalog = createCatalogBuilder({
  bookRepository,
  uuidGenerator: uuidV4Generator,
})
