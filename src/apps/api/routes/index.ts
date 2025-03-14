import { Router } from 'express';

import { SchemaValidator } from '../validations/schema-validators';

import { postCreateReferenceRequestSchema } from './references/post-create-reference-request';
import {
  deleteReferenceByIdController,
  getReferenceByIdController,
  getReferencesController,
  postCreateReferenceController,
} from './references';
import { getReferencesRequestSchema } from './references/get-references-request';
import { postCreateReservationRequestSchema } from './reservations/post-create-reservation.request';
import {
  getReservationController,
  getReservationsByUserIdController,
  postBorrowBookController,
  postCreateReservationController,
  postReturnBookController,
} from './reservations';
import { postCreateBookRequestSchema } from './books/post-create-book-request';
import { getBookController, getBooksController, postCreateBookController } from './books';
import { postBorrowBookRequestSchema } from './reservations/post-borrow-book-request';
import { postReturnBookRequestSchema } from './reservations/post-return-book-request';

const routes = Router();

routes.post('/references', SchemaValidator.body(postCreateReferenceRequestSchema), postCreateReferenceController);
routes.get('/references/search', SchemaValidator.query(getReferencesRequestSchema), getReferencesController);
routes.get('/references/:id', getReferenceByIdController);
routes.get('/references/:id/books', getBooksController);
routes.delete('/references/:id', deleteReferenceByIdController);

routes.post('/reservations', SchemaValidator.body(postCreateReservationRequestSchema), postCreateReservationController);
routes.post('/reservations/:id/borrow', SchemaValidator.body(postBorrowBookRequestSchema), postBorrowBookController);
routes.post('/reservations/:id/return', SchemaValidator.body(postReturnBookRequestSchema), postReturnBookController);
routes.get('/reservations/:id', getReservationController);

routes.post('/books', SchemaValidator.body(postCreateBookRequestSchema), postCreateBookController);
routes.get('/books/:id', getBookController);

routes.get('/users/me/reservations', getReservationsByUserIdController);

export default routes;
