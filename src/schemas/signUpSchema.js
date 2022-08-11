import Joi from "joi";

export const signupSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.ref('password'),
    username: Joi.string().required(),
    picture: Joi.string().uri().required()
});