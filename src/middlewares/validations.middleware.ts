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

export const validateChangePassword = {
  body: Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required().min(8),
    userId: Joi.string().required(),
  }),
};

export const validateForgotPassword = {
  body: Joi.object({
    otp: Joi.string().required(),
    newPassword: Joi.string().required().min(8),
  }),
};

export const validateCreateEvent = {
  body: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    date: Joi.string().required().isoDate(),
    location: Joi.string().required(),
    organizerId: Joi.string().required().uuid(),
  }),
};

export const validateGetEventByOrganizer = {
  params: Joi.object({
    organizerId: Joi.string().required().uuid(),
  }),
};

export const validateGetEventById = {
  params: Joi.object({
    eventId: Joi.string().required().uuid(),
  }),
};

export const validateGetAllEventsInADay = {
  params: Joi.object({
    day: Joi.string().required(),
  }),
};

export const validateGetAllEventsInAMonth = {
  params: Joi.object({
    month: Joi.string().required(),
  }),
};

export const validateUpdateEvent = {
  params: Joi.object({
    eventId: Joi.string().required().uuid(),
    organizerId: Joi.string().required().uuid(),
  }),
  body: Joi.object({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    date: Joi.string().optional().isoDate(),
    location: Joi.string().optional(),
  }),
};

export const validateDeleteEvent = {
  params: Joi.object({
    eventId: Joi.string().required().uuid(),
    organizerId: Joi.string().required().uuid(),
  }),
};

export const validateSetOrUpdateEventPrice = {
  params: Joi.object({
    eventId: Joi.string().required().uuid(),
    organizerId: Joi.string().required().uuid(),
  }),
  body: Joi.object({
    seatPrice: Joi.number().required(),
  }),
};
