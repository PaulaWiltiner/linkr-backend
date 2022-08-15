import Joi from "joi";

export const createPostSchema = Joi.object({
  description: Joi.string().allow(""),
  link: Joi.string().uri().required(),
});

export const updateSchema = Joi.object({
  description: Joi.string().required(),
});
