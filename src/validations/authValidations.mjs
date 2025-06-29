import Joi from "joi";

const username = Joi.string().min(3).max(30).required();
const password = Joi.string().min(6).required();
const roleId = Joi.number().integer().required();
const name = Joi.string().required()

export const registerSchema = Joi.object({
  username,
  password,
  name,
  roleId
});

export const loginSchema = Joi.object({
  username,
  password
});
