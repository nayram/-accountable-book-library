import Joi from 'joi';
import { ContainerTypes, ValidatedRequest, ValidatedRequestSchema } from 'express-joi-validation';

export const getReservationsRequestSchema = {
  cursor: Joi.string().optional().default(null),
  limit: Joi.number().optional().default(5),
  userId: Joi.string().optional().default(null),
  referenceId: Joi.string().optional().default(null),
};

interface GetReservationsRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    cursor: string | null;
    limit: number;
    userId: string | null;
    referenceId: string | null;
    status: string | null;
  };
}

export type GetReservationsRequest = ValidatedRequest<GetReservationsRequestSchema>;
