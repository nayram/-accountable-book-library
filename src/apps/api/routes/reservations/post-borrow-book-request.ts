import Joi from 'joi';
import { ContainerTypes, ValidatedRequest, ValidatedRequestSchema } from 'express-joi-validation';

export const postBorrowBookRequestSchema = {
  dueAt: Joi.string().required(),
};

interface PostBorrowBookRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    dueAt: string;
  };
}

export type PostBorrowBookRequest = ValidatedRequest<PostBorrowBookRequestSchema>;
