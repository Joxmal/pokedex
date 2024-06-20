import * as Joi from 'joi';


export const JoiValidationShema = Joi.object({
  MONGODB:  Joi.required(),
  PORT: Joi.number().default(3005),
  DEFAULT_LIMIT_POKEMON: Joi.number().default(20),
})