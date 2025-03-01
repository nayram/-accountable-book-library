import { createCatalog } from '@modules/catalogs/application';

import { postCreateCatalogControllerBuilder } from './post-create-catalog-controller';

export const postCreateCatalogController = postCreateCatalogControllerBuilder({
  createCatalog,
});
