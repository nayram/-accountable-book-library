import Joi from 'joi';
import { createValidator } from 'express-joi-validation';

export const SchemaValidator = {
  query(schema: Joi.PartialSchemaMap) {
    return createJoiSchemaValidator().query(createJoiSchema(schema).options({ allowUnknown: true }));
  },

  body(schema: Joi.PartialSchemaMap) {
    return createJoiSchemaValidator().body(createJoiSchema(schema));
  },
};

function createJoiSchema(joiSchema: Joi.PartialSchemaMap) {
  return Joi.object(joiSchema).options({ errors: { wrap: { label: false } } });
}

function createJoiSchemaValidator() {
  return createValidator({ passError: true });
}
