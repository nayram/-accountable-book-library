import Joi from 'joi';
import { ContainerTypes, ValidatedRequest, ValidatedRequestSchema } from 'express-joi-validation';

export const getReferencesRequestSchema = {
  cursor: Joi.string().optional().default(null),
  limit: Joi.number().optional().default(5),
  author: Joi.string().optional().default(null),
  publicationYear: Joi.number().optional().default(null),
  title: Joi.string().optional().default(null),
};

interface GetReferencesRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    cursor: string | null;
    limit: number;
    title: string | null;
    author: string | null;
    publicationYear: number | null;
  };
}

export type GetReferencesRequest = ValidatedRequest<GetReferencesRequestSchema>;
