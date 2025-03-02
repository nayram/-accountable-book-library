import { Router } from 'express';

import { SchemaValidator } from '../validations/schema-validators';

import { postCreateCatalogRequestSchema } from './catalogs/post-create-catalog-request';
import {
  deleteCatalogByIdController,
  getCatalogByIdController,
  getCatalogsController,
  postCreateCatalogController,
} from './catalogs';
import { getCatalogsRequestSchema } from './catalogs/get-catalogs-request';

const routes = Router();

routes.post('/catalogs', SchemaValidator.body(postCreateCatalogRequestSchema), postCreateCatalogController);
routes.get('/catalogs/search', SchemaValidator.query(getCatalogsRequestSchema), getCatalogsController);
routes.get('/catalogs/:id', getCatalogByIdController);
routes.delete('/catalogs/:id', deleteCatalogByIdController);

export default routes;
