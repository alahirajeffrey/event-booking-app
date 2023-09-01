// import { Router } from "express";
// import * as authRoutes from "../controllers/auth.controller";
// import * as validations from "../middlewares/validations.middleware";
// import { validate } from "express-validation";
// import passport from "passport";
// import "../config/passport.config";
// import {
//   authGoogle,
//   authGoogleRedirect,
// } from "../controllers/booking.controller";

// const authRouter = Router();

// authRouter.post(
//   "/register",
//   validate(validations.validateRegisterUser, {}, {}),
//   authRoutes.registerUser
// );

// authRouter.get("/google/calender", authGoogle);

// authRouter.get("/google/calender/redirect", authGoogleRedirect);

// authRouter.post(
//   "/login",
//   validate(validations.validateLoginUser, {}, {}),
//   authRoutes.loginUser
// );

// authRouter.post(
//   "/change-password/:userId",
//   validate(validations.validateChangePassword, {}, {}),
//   passport.authenticate("jwt", { session: false }),
//   authRoutes.changePassword
// );

// authRouter.post(
//   "/send-verification-otp",
//   validate(validations.validateSendVerificationOtp, {}, {}),
//   passport.authenticate("jwt", { session: false }),
//   authRoutes.sendVerificationOtp
// );

// authRouter.patch(
//   "/verify-user",
//   validate(validations.validateVerifyUser, {}, {}),
//   passport.authenticate("jwt", { session: false }),
//   authRoutes.verifyUser
// );

// authRouter.post(
//   "/send-reset-password-otp",
//   validate(validations.validateSendResetPasswordOtp, {}, {}),
//   authRoutes.sendResetPasswordOtp
// );

// authRouter.patch(
//   "/reset-password",
//   validate(validations.validateResetPassword, {}, {}),
//   authRoutes.resetPassword
// );

// authRouter.post(
//   "/refresh-token",
//   validate(validations.validateRefreshToken, {}, {}),
//   authRoutes.refreshAccessToken
// );

// export default authRouter;
