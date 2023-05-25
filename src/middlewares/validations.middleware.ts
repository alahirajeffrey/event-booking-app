import { Joi } from "express-validation";

export const validateRegisterUser = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
};

export const validateLoginUser = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

export const validateSendVerificationOtp = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
  params: Joi.object({
    userId: Joi.string().guid().required(),
  }),
};

export const validateVerifyUser = {
  body: Joi.object({
    otp: Joi.string().required().min(4),
  }),
};

export const validateRefreshToken = {
  body: Joi.object({
    refrshToken: Joi.string().required(),
  }),
  params: Joi.object({
    userId: Joi.string().required(),
  }),
};
