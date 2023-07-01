import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { ApiResponse } from "../types/response.type";
import prisma from "../config/prisma.config";
import decodeToken from "../helpers/decodeToken.helper";
import { google } from "googleapis";
import config from "../config/config.config";
import { publisher } from "../services/rabbitmq-pulisher.service";
import { EventStatusEnum } from "../common/enums/event-status.enum";
import logger from "../helpers/logger";
import { createCalenderId } from "../helpers/createCalenderId.helper";

const oauth2Client = new google.auth.OAuth2(
  config.OAUTH_CLIENT_ID,
  config.OAUTH_CLIENT_SECRET,
  `${config.OAUTH_REDIRECT_BASE_URI}:${config.PORT}/api/v1/auth/google/calender/redirect`
);
const calendar = google.calendar({ version: "v3", auth: oauth2Client });

/**
 * generate and redirect user to authentication url
 * @param req
 * @param res
 */
export const authGoogle = (req: Request, res: Response) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar"],
  });
  res.redirect(authUrl);
};

/**
 * retrieve authorization code from query parameters
 * @param req
 * @param res
 */
export const authGoogleRedirect = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  const code = req.query.code as string;
  const { tokens } = await oauth2Client.getToken(code.toString());
  oauth2Client.setCredentials(tokens);

  return res.status(StatusCodes.OK).json({ message: "user authenticated" });
};

/**
 * book a free event
 * @param req : Request object containing th eventId
 * @param res : Response object
 */
export const bookAFreeEvent = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    const { eventId, email } = req.body;

    // check if event exists
    const eventExists = await prisma.event.findFirst({
      where: { id: eventId },
    });
    if (!eventExists) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "event does not exist" });
    }

    //ensure organizer cannot book own event
    const authHeader = req.headers["authorization"] || "defaultAuthHeader";
    const user: any = decodeToken(authHeader);

    if (eventExists.organizerId === user.id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "you cannot book an event in which you are the organizer",
      });
    }
    // book event
    await prisma.booking.create({
      data: {
        eventId: eventExists.id,
        userId: user.id,
      },
    });

    // create payload
    const payload = {
      to: email,
      eventTitle: eventExists.title,
      location: eventExists.location,
      time: eventExists.date,
      paymentId: null,
      subject: EventStatusEnum.Created,
    };

    // send payload to notification microservice to send email
    await publisher(payload, "NOTIFICATION", "send-booking-details");

    const year = eventExists.date.getFullYear();
    const month = eventExists.date.getMonth() + 1;
    const day = eventExists.date.getDate();

    // create google calender id from event it
    const id = createCalenderId(eventExists.id);

    // insert event to calender
    calendar.events
      .insert({
        calendarId: "primary",
        auth: oauth2Client,
        requestBody: {
          id: id,
          summary: `${eventExists.title}`,
          description: `${eventExists.description}`,
          start: {
            date: `${year}-${month}-${day}`,
          },
          end: {
            date: `${year}-${month}-${day}`,
          },
        },
      })
      .then((event) => {
        logger.info(`event creation status: ${event.status}`);
      })
      .catch((err) => {
        logger.error(err);
        throw err;
      });

    return res.status(StatusCodes.OK).json({
      message: "event booked. booking details have been sent to your mail",
    });
  } catch (error: any) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

/**
 * cancel event booking
 * @param req : request object containing bookingId and email
 * @param res : response object
 */
export const cancelAFreeBooking = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    const bookingId = req.params.bookingId;
    const email = req.body.email;

    // check if event exists
    const bookingExits = await prisma.booking.findFirst({
      where: { id: bookingId },
    });
    if (!bookingExits) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "booking does not exist" });
    }

    // get event details
    const eventDetails = await prisma.event.findFirstOrThrow({
      where: { id: bookingExits.eventId },
    });

    // ensure booking can only be canceled by whoever booked it
    const authHeader = req.headers["authorization"] || "defaultAuthHeader";
    const user: any = decodeToken(authHeader);

    if (bookingExits.userId != user.id) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "you cannot cancel a booking you did not make" });
    }

    // create payload
    const payload = {
      to: email,
      eventTitle: eventDetails.title,
      location: eventDetails.location,
      time: eventDetails.date,
      paymentId: null,
      subject: EventStatusEnum.Canceled,
    };

    // send payload to notification microservice to send email
    await publisher(payload, "NOTIFICATION", "send-booking-details");

    // cancel event
    await prisma.booking.delete({ where: { id: bookingId } });

    const id = createCalenderId(eventDetails.id);
    // delete event from calender
    calendar.events
      .delete({
        calendarId: "primary",
        eventId: id,
        auth: oauth2Client,
      })
      .then(() => logger.info("event removed from calender"))
      .catch((err) => {
        logger.error(err);
      });

    return res.status(StatusCodes.OK).json({ message: "booking canceled" });
  } catch (error: any) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

/**
 * refresh access token
 * @param req
 * @param res
 */
export const bookAPaidEvent = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    return res.status(StatusCodes.OK).json({
      message: "event booked. booking details have been sent to your mail",
    });
  } catch (error: any) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

/**
 * refresh access token
 * @param req
 * @param res
 */
export const cancelAPaidBooking = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    return res.status(StatusCodes.OK).json({ message: "booking canceled" });
  } catch (error: any) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
