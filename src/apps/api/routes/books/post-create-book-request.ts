import Joi from 'joi';
import { ContainerTypes, ValidatedRequest, ValidatedRequestSchema } from 'express-joi-validation';

import { BookStatus } from '@modules/shared/books/domain/book/book-status';

export const postCreateBookRequestSchema = {
  referenceId: Joi.string().required(),
  barcode: Joi.string().alphanum().required(),
  status: Joi.string().optional().default(BookStatus.Available),
};

interface PostCreateBookRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    referenceId: string;
    barcode: string;
    status: string;
  };
}

export type PostCreateBookRequest = ValidatedRequest<PostCreateBookRequestSchema>;
