import Joi from 'joi';
import { ContainerTypes, ValidatedRequest, ValidatedRequestSchema } from 'express-joi-validation';

export const postReturnBookRequestSchema = {
  returnedAt: Joi.string().required(),
};

interface PostReturnBookRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    returnedAt: string;
  };
}

export type PostReturnBookRequest = ValidatedRequest<PostReturnBookRequestSchema>;
