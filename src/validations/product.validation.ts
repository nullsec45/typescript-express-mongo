import Joi from 'joi';
import type ProductType from '../types/product.type';

export const createProductValidation = (payload: ProductType) => {
  const schema = Joi.object({
    product_id: Joi.string().required(),
    name: Joi.string().required(),
    price: Joi.number().allow('', null),
    size: Joi.string().allow('', null)
  });

  return schema.validate(payload);
};

export const updateProductValidation = (payload: ProductType) => {
  const schema = Joi.object({
    name: Joi.string(),
    price: Joi.number().allow('', null),
    size: Joi.string().allow('', null)
  });

  return schema.validate(payload);
};
