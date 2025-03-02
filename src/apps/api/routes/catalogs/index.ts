import { createCatalog, findCatalogByBookId, deleteCatalogByBookId } from '@modules/catalogs/application';

import { postCreateCatalogControllerBuilder } from './post-create-catalog-controller';
import { getFindCatalogByIdControllerBuilder } from './get-find-catalog-by-id-controller';
import { deleteCatalogByIdControllerBuilder } from './delete-catalog-by-id-controller';

export const postCreateCatalogController = postCreateCatalogControllerBuilder({
  createCatalog,
});
export const getFindCatalogByIdController = getFindCatalogByIdControllerBuilder({ findCatalogByBookId });
export const deleteCatalogByIdController = deleteCatalogByIdControllerBuilder({ deleteCatalogByBookId });
