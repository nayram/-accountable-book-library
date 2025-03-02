import { createCatalog, findCatalogByBookId, deleteCatalogByBookId, findCatalogs } from '@modules/catalogs/application';

import { postCreateCatalogControllerBuilder } from './post-create-catalog-controller';
import { getCatalogByIdControllerBuilder } from './get-catalog-by-id-controller';
import { deleteCatalogByIdControllerBuilder } from './delete-catalog-by-id-controller';
import { getCatalogsControllerBuilder } from './get-catalogs-controller';

export const postCreateCatalogController = postCreateCatalogControllerBuilder({
  createCatalog,
});
export const getCatalogByIdController = getCatalogByIdControllerBuilder({ findCatalogByBookId });
export const getCatalogsController = getCatalogsControllerBuilder({ findCatalogs });
export const deleteCatalogByIdController = deleteCatalogByIdControllerBuilder({ deleteCatalogByBookId });
