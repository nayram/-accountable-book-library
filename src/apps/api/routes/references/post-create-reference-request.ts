import Joi from 'joi';
import { ContainerTypes, ValidatedRequest, ValidatedRequestSchema } from 'express-joi-validation';

export const postCreateReferenceRequestSchema = {
  title: Joi.string().required(),
  externalReferenceId: Joi.string().required(),
  author: Joi.string().required(),
  publicationYear: Joi.number().required(),
  publisher: Joi.string().required(),
  price: Joi.number().required(),
};

interface PostCreateReferenceRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    externalReferenceId: string;
    title: string;
    author: string;
    publicationYear: number;
    publisher: string;
    price: number;
  };
}

export type PostCreateReferenceRequest = ValidatedRequest<PostCreateReferenceRequestSchema>;
