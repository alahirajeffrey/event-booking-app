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
    userId: Joi.string().guid().required(),
  }),
};

export const validateVerifyUser = {
  body: Joi.object({
    otpProvided: Joi.string().required().min(4),
    userId: Joi.string().guid().required(),
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

export const validateChangePassword = {
  body: Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required().min(8),
    userId: Joi.string().required(),
  }),
};

export const validateResetPassword = {
  body: Joi.object({
    otpProvided: Joi.string().required(),
    newPassword: Joi.string().required().min(8),
    email: Joi.string().required().email(),
  }),
};

export const validateSendResetPasswordOtp = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
};
