import Joi from 'joi';
import { ContainerTypes, ValidatedRequest, ValidatedRequestSchema } from 'express-joi-validation';

export const postCreateReservationRequestSchema = {
  userId: Joi.string().required(),
  referenceId: Joi.string().required(),
};

interface PostCreateReservationRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    userId: string;
    referenceId: string;
  };
}

export type PostCreateReservationRequest = ValidatedRequest<PostCreateReservationRequestSchema>;
