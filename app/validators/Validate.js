const Joi = require('joi');

const createUserSchema = Joi.object({
email: Joi.string()
  .email({ tlds: { allow: false } })
  .required(),

  password: Joi.string()
  .min(6) // Require password to be at least 6 characters long
  .regex(/^(?=.*[!@#$%^&*])/) // Require password to contain at least one symbol
  .required(),
});


const loginUserSchema = Joi.object({
  email: Joi.string()
  .email({ tlds: { allow: false } })
  .required(),

  password: Joi.string()
  .min(6) // Require password to be at least 6 characters long
  .regex(/^(?=.*[!@#$%^&*])/) // Require password to contain at least one symbol
  .required(),
});

module.exports = {
  loginUserSchema,
  createUserSchema
}
  
  
  
