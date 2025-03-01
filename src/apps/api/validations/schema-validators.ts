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

/**
 * Creates a Joi Schema with some predefined options:
 *    - errors.wrap.label = false -> to remove any wrapping around `{#label}`
 *      references
 */
function createJoiSchema(joiSchema: Joi.PartialSchemaMap) {
  return Joi.object(joiSchema).options({ errors: { wrap: { label: false } } });
}

/**
 * Creates a Joi Schema Validator with some predefined options:
 *    - passError = true ->  Passes validation errors to the express error
 *      hander using next(err) (more info @
 *      https://www.npmjs.com/package/express-joi-validation#createvalidatorconfig)
 */
function createJoiSchemaValidator() {
  return createValidator({ passError: true });
}
