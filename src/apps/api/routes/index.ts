import { Router } from 'express';

import { SchemaValidator } from '../validations/schema-validators';

import { postCreateCatalogRequestSchema } from './catalogs/post-create-catalog-request';
import { postCreateCatalogController } from './catalogs';

const routes = Router();

routes.post('/catalogs', SchemaValidator.body(postCreateCatalogRequestSchema), postCreateCatalogController);

export default routes;
