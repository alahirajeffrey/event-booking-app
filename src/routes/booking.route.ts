import { Router } from "express";
import * as validations from "../middlewares/validations.middleware";
import { validate } from "express-validation";
import passport from "passport";
import "../config/passport.config";
import * as bookingRoutes from "../controllers/booking.controller";

const bookingRouter = Router();

bookingRouter.get("/auth/google", bookingRoutes.authGoogle);

bookingRouter.get("/auth/google/callback", bookingRoutes.authGoogleCallback);

bookingRouter.post(
  "/book-free-event",
  validate(validations.validateBookAFreeEvent, {}, {}),
  passport.authenticate("jwt", { session: false }),
  bookingRoutes.bookAFreeEvent
);

bookingRouter.delete(
  "/cancel-free-booking/:bookingId",
  validate(validations.validateCancelAFreeBooking, {}, {}),
  passport.authenticate("jwt", { session: false }),
  bookingRoutes.cancelAFreeBooking
);

bookingRouter.post(
  "/book-paid-event",
  //   validate(validations.validateBookAPaidEvent, {}, {}),
  //   passport.authenticate("jwt", { session: false }),
  bookingRoutes.bookAPaidEvent
);

bookingRouter.delete(
  "/cancel-paid-booking",
  // validate(validations.validateCancelAPaidBooking, {}, {}),
  // passport.authenticate("jwt", { session: false }),
  bookingRoutes.cancelAPaidBooking
);

export default bookingRouter;
