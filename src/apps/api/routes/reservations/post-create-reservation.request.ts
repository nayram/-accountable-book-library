import Joi from 'joi';
import { ContainerTypes, ValidatedRequest, ValidatedRequestSchema } from 'express-joi-validation';

export const postCreateReservationRequestSchema = {
  bookId: Joi.string().required(),
};

interface PostCreateReservationRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    bookId: string;
  };
}

export type PostCreateReservationRequest = ValidatedRequest<PostCreateReservationRequestSchema>;
