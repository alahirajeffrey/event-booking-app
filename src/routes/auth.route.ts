import { Router } from "express";
import * as authRoutes from "../controllers/auth.controller";
import * as validations from "../middlewares/validations.middleware";
import { validate } from "express-validation";
import passport from "passport";
import "../config/passport.config";

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
  passport.authenticate("jwt", { session: false }),
  authRoutes.sendVerificationOtp
);

authRouter.post(
  "/verify-user",
  validate(validations.validateVerifyUser),
  passport.authenticate("jwt", { session: false }),
  authRoutes.verifyUser
);

authRouter.post(
  "/refresh-token",
  validate(validations.validateRefreshToken),
  passport.authenticate("jwt", { session: false }),
  authRoutes.refreshAccessToken
);

authRouter.post(
  "/change-password/:userId",
  validate(validations.validateChangePassword),
  passport.authenticate("jwt", { session: false }),
  authRoutes.changePassword
);

authRouter.post(
  "/forgot-password",
  validate(validations.validateForgotPassword),
  authRoutes.refreshAccessToken
);

export default authRouter;
