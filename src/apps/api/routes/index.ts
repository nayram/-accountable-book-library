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
import { postCreateReservationRequestSchema } from './reservations/post-create-reservation.request';
import { getReservationsController, postCreateReservationController } from './reservations';
import { getReservationsRequestSchema } from './reservations/get-reservations-request';

const routes = Router();

routes.post('/references', SchemaValidator.body(postCreateReferenceRequestSchema), postCreateReferenceController);
routes.get('/references/search', SchemaValidator.query(getReferencesRequestSchema), getReferencesController);
routes.get('/references/:externalReferenceId', getReferenceByExternalReferenceIdController);
routes.delete('/references/:id', deleteReferenceByIdController);

routes.post('/reservations', SchemaValidator.body(postCreateReservationRequestSchema), postCreateReservationController);
routes.get('/reservations', SchemaValidator.query(getReservationsRequestSchema), getReservationsController);

export default routes;
