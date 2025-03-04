import { Router } from 'express';

import { SchemaValidator } from '../validations/schema-validators';

import { postCreateReferenceRequestSchema } from './references/post-create-reference-request';
import {
  deleteReferenceByIdController,
  getReferenceByExternalReferenceIdController,
  getReferencesController,
  postCreateReferenceController,
} from './references';
import { getReferencesRequestSchema } from './references/get-references-request';

const routes = Router();

routes.post('/references', SchemaValidator.body(postCreateReferenceRequestSchema), postCreateReferenceController);
routes.get('/references/search', SchemaValidator.query(getReferencesRequestSchema), getReferencesController);
routes.get('/references/:externalReferenceId', getReferenceByExternalReferenceIdController);
routes.delete('/references/:id', deleteReferenceByIdController);

export default routes;
