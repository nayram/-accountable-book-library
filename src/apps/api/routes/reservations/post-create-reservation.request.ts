import Joi from 'joi';
import { ContainerTypes, ValidatedRequest, ValidatedRequestSchema } from 'express-joi-validation';

export const postCreateReservationRequestSchema = {
  userId: Joi.string().required(),
  bookId: Joi.string().required(),
};

interface PostCreateReservationRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    userId: string;
    bookId: string;
  };
}

export type PostCreateReservationRequest = ValidatedRequest<PostCreateReservationRequestSchema>;
