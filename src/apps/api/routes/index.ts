import { Router } from 'express';

import { SchemaValidator } from '../validations/schema-validators';

import { postCreateCatalogRequestSchema } from './catalogs/post-create-catalog-request';
import { getFindCatalogByIdController, postCreateCatalogController } from './catalogs';

const routes = Router();

routes.post('/catalogs', SchemaValidator.body(postCreateCatalogRequestSchema), postCreateCatalogController);
routes.get('/catalogs/:id', getFindCatalogByIdController);

export default routes;
