import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { ApiResponse } from "../types/response.type";
import sendBookingEmail, {
  EventStatusEnum,
} from "../emails/booking/sendBookingEmail";
import prisma from "../config/prisma.config";
import decodeToken from "../helpers/decodeToken.helper";

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

    // send booking details via email
    await sendBookingEmail(
      email,
      eventExists.title,
      eventExists.date,
      eventExists.location,
      null,
      EventStatusEnum.Created
    );

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

    // send email
    await sendBookingEmail(
      email,
      eventDetails.title,
      eventDetails.date,
      eventDetails.location,
      null,
      EventStatusEnum.Canceled
    );

    // cancel event
    await prisma.booking.delete({ where: { id: bookingId } });

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
