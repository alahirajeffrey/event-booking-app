import { Router } from "express";
import passport from "passport";
import "../config/passport.config";
import * as eventControllers from "../controllers/event.controller";
import { validate } from "express-validation";
import * as validations from "../middlewares/validations.middleware";

const eventRouter = Router();

eventRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  validate(validations.validateCreateEvent, {}, {}),
  eventControllers.createEvent
);

eventRouter.get(
  "/organizer/:organizerId",
  passport.authenticate("jwt", { session: false }),
  validate(validations.validateGetEventByOrganizer, {}, {}),
  eventControllers.getEventsByOrganizerId
);

eventRouter.get(
  "/:eventId",
  passport.authenticate("jwt", { session: false }),
  validate(validations.validateGetEventById, {}, {}),
  eventControllers.getEventById
);

eventRouter.get(
  "/:day",
  //   passport.authenticate("jwt"),
  validate(validations.validateGetAllEventsInADay, {}, {}),
  eventControllers.getAllEventsInADay
);

eventRouter.get(
  "/:month",
  //   passport.authenticate("jwt"),
  validate(validations.validateGetAllEventsInAMonth, {}, {}),
  eventControllers.getAllEventsInAMonth
);

eventRouter.patch(
  "/:eventId/:organizerId",
  passport.authenticate("jwt", { session: false }),
  validate(validations.validateUpdateEvent, {}, {}),
  eventControllers.updateEvent
);

eventRouter.delete(
  "/:eventId/:organizerId",
  passport.authenticate("jwt", { session: false }),
  validate(validations.validateDeleteEvent, {}, {}),
  eventControllers.deleteEvent
);

eventRouter.patch(
  "/price/:eventId/:organizerId",
  passport.authenticate("jwt", { session: false }),
  validate(validations.validateSetOrUpdateEventPrice, {}, {}),
  eventControllers.setOrUpdateEventPrice
);

export default eventRouter;
