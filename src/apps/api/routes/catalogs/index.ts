import { createCatalog, findCatalogByBookId } from '@modules/catalogs/application';

import { postCreateCatalogControllerBuilder } from './post-create-catalog-controller';
import { getFindCatalogByIdControllerBuilder } from './get-find-catalog-by-id-controller';

export const postCreateCatalogController = postCreateCatalogControllerBuilder({
  createCatalog,
});

export const getFindCatalogByIdController = getFindCatalogByIdControllerBuilder({ findCatalogByBookId });
