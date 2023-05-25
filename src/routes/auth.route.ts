import { Router } from "express";
import * as authRoutes from "../controllers/auth.controller";
import * as validations from "../middlewares/validations.middleware";
import { validate } from "express-validation";

const authRouter = Router();

authRouter.post(
  "/register",
  validate(validations.validateRegisterUser),
  authRoutes.registerUser
);

authRouter.post(
  "/login",
  validate(validations.validateLoginUser),
  authRoutes.loginUser
);

authRouter.post(
  "/send-verification-otp",
  validate(validations.validateSendVerificationOtp),
  authRoutes.sendVerificationOtp
);

authRouter.post(
  "/verify-user",
  validate(validations.validateVerifyUser),
  authRoutes.verifyUser
);

authRouter.post(
  "/refresh-token",
  validate(validations.validateRefreshToken),
  authRoutes.refreshAccessToken
);

authRouter.post(
  "/change-password",
  validate(validations.validateChangePassword),
  authRoutes.refreshAccessToken
);

authRouter.post(
  "/forgot-password",
  validate(validations.validateForgotPassword),
  authRoutes.refreshAccessToken
);

export default authRouter;
