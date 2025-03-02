import Joi from 'joi';
import { ContainerTypes, ValidatedRequest, ValidatedRequestSchema } from 'express-joi-validation';

export const postCreateCatalogRequestSchema = {
  title: Joi.string().required(),
  referenceId: Joi.string().required(),
  author: Joi.string().required(),
  publicationYear: Joi.number().required(),
  publisher: Joi.string().required(),
  price: Joi.number().required(),
  quantity: Joi.number().optional().default(4),
};

interface PostCreateCatalogRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    referenceId: string;
    title: string;
    author: string;
    publicationYear: number;
    publisher: string;
    price: number;
    quantity: number;
  };
}

export type PostCreateCatalogRequest = ValidatedRequest<PostCreateCatalogRequestSchema>;
