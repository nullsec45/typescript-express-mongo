import Joi from 'joi';
import type UserType from '../types/user.type';

export const createUserValidation = (payload: UserType) => {
  const schema = Joi.object({
    user_id: Joi.string().required(),
    email: Joi.string().required(),
    name: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().allow('', null)
  });

  return schema.validate(payload);
};

export const createSessionValidation = (payload: UserType) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
  });

  return schema.validate(payload);
};

export const createRefreshTokenValidation = (payload: UserType) => {
  const schema = Joi.object({
    refresh_token: Joi.string().required()
  });

  return schema.validate(payload);
};
