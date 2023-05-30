import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../config/prisma.config";
import { ApiResponse } from "../types/response.type";
import decodeToken from "../helpers/decodeToken.helper";
import { Event } from "@prisma/client";

/**
 * checks if an event exists
 * @param eventId : event id
 * @returns an event object or null
 */
const checkIfEventExists = async (eventId: string): Promise<Event | null> => {
  return await prisma.event.findFirst({ where: { id: eventId } });
};

/**
 * create an event
 * @param req : request object containing title, description, date, location, organizerId and price
 * @param res : response object
 * @returns : status code and message
 */
export const createEvent = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    const { title, description, date, location, organizerId } = req.body;

    await prisma.event.create({
      data: {
        title: title,
        description: description,
        date: date,
        location: location,
        organizerId: organizerId,
      },
    });
    return res.status(StatusCodes.CREATED).json({ message: "event created" });
  } catch (error: any) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

/**
 * get all events created by an organizer
 * @param req : request object containing organizerId param
 * @param res : response object
 * @returns status code and list of event objects
 */
export const getEventsByOrganizerId = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    const organizerId = req.params.organizerId;

    const events = await prisma.event.findMany({
      where: { organizerId: organizerId },
    });

    console.log(events);
    return res.status(StatusCodes.OK).json(events);
  } catch (error: any) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

/**
 * get event by id
 * @param req : request object containing eventId param
 * @param res : response object
 * @returns : status message and event object
 */
export const getEventById = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    const eventId = req.params.eventId;

    const event = await checkIfEventExists(eventId);
    if (!event) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "event does not exist" });
    }

    return res.status(StatusCodes.OK).json(event);
  } catch (error: any) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

/**
 * updates an event
 * @param req : request object containg params and body
 * @param res : response object
 * @returns : status code and message
 */
export const updateEvent = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    const { eventId, organizerId } = req.params;
    const { title, description, date, location } = req.body;

    // check if event exists
    const eventExists = await checkIfEventExists(eventId);
    if (!eventExists) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "event does not exist" });
    }

    // get userId from jwt to ensure only owner can delete an event
    const authHeader = req.headers["authorization"] || "defaultAuthHeader";
    const user: any = decodeToken(authHeader);

    if (organizerId != user.id) {
      return res
        .status(StatusCodes.METHOD_NOT_ALLOWED)
        .json({ message: "you cannot update an event you did not create" });
    }

    await prisma.event.update({
      where: { id: eventId },
      data: {
        title: title,
        description: description,
        date: date,
        location: location,
      },
    });
    return res.status(StatusCodes.OK).json({ message: "event updated" });
  } catch (error: any) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

/**
 * deletes an event
 * @param req : request object containing eventId and organizerId
 * @param res : response object
 * @returns : status code and message
 */
export const deleteEvent = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    const { eventId, organizerId } = req.params;

    // check if event exists
    const eventExists = await checkIfEventExists(eventId);
    if (!eventExists) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "event does not exist" });
    }

    // get userId from jwt and ensure only owner can delete an event
    const authHeader = req.headers["authorization"] || "defaultAuthHeader";
    const user: any = decodeToken(authHeader);

    if (organizerId != user.id) {
      return res
        .status(StatusCodes.METHOD_NOT_ALLOWED)
        .json({ message: "you cannot delete an event you did not create" });
    }

    await prisma.event.delete({ where: { id: eventId } });

    return res.status(StatusCodes.OK).json({ message: "event deleted" });
  } catch (error: any) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

/**
 *
 * @param req : request object containing eventId and organizerId params
 * @param res : response object
 * @returns : status code and response message
 */
export const setOrUpdateEventPrice = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    const { eventId, organizerId } = req.params;
    const seatPrice = req.body.seatPrice;

    // check if event exists
    const eventExists = await checkIfEventExists(eventId);
    if (!eventExists) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "event does not exist" });
    }

    // get userId from jwt and ensure only owner can delete an event
    const authHeader = req.headers["authorization"] || "defaultAuthHeader";
    const user: any = decodeToken(authHeader);

    if (organizerId != user.id) {
      return res
        .status(StatusCodes.METHOD_NOT_ALLOWED)
        .json({ message: "you cannot delete an event you did not create" });
    }

    await prisma.event.update({
      where: { id: eventId },
      data: { seatPrice: seatPrice },
    });
    return res.status(StatusCodes.OK).json({ message: "price added" });
  } catch (error: any) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const getAllEventsInADay = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    return res.status(StatusCodes.OK).json({ message: "event" });
  } catch (error: any) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const getAllEventsInAMonth = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    return res.status(StatusCodes.OK).json({ message: "event" });
  } catch (error: any) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
