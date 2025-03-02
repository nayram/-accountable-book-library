import { Router } from 'express';

import { SchemaValidator } from '../validations/schema-validators';

import { postCreateCatalogRequestSchema } from './catalogs/post-create-catalog-request';
import { deleteCatalogByIdController, getFindCatalogByIdController, postCreateCatalogController } from './catalogs';

const routes = Router();

routes.post('/catalogs', SchemaValidator.body(postCreateCatalogRequestSchema), postCreateCatalogController);
routes.get('/catalogs/:id', getFindCatalogByIdController);
routes.delete('/catalogs/:id', deleteCatalogByIdController);

export default routes;
