import Joi from 'joi';

export interface Pagination {
  page: number;
  pageSize: number;
}

export const paginationSchema = {
  page: Joi.number().required(),
  pageSize: Joi.number().required(),
};
