import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import prisma from "../config/prisma.config";
import { ApiResponse } from "../types/response.type";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { generateOtp } from "../helpers/generateOtp.helper";
import { publisher } from "../services/rabbitmq-pulisher.service";
import config from "../config/config.config";

/**
 * checks if a user exists or not by email
 * @param email : string
 * @returns : user object or null
 */
const checkUserExistsByEmail = async (email: string): Promise<User | null> => {
  return await prisma.user.findFirst({ where: { email: email } });
};

/**
 * checks if a user exists or not by id
 * @param id : string
 * @returns : user object or null
 */
const checkUserExistsById = async (id: string): Promise<User | null> => {
  return await prisma.user.findFirst({ where: { id: id } });
};

/**
 * registers a new user
 * @param req : request object containing email and password
 * @param res : response object
 * @returns : status code and message
 */
export const registerUser = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    const { email, password } = req.body;

    // ensure two users cannot register with same email
    const userExists = await checkUserExistsByEmail(email);
    if (userExists) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "user alreasy exists" });
    }

    // hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // save to db
    await prisma.user.create({
      data: { email: email, password: hashedPassword },
    });

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "user registered successfully" });
  } catch (error: any) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

/**
 *
 * @param req : request object containing email and password
 * @param res : response object
 * @returns : access token
 */
export const loginUser = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    const { email, password } = req.body;

    //check if user exists
    const userExists = await checkUserExistsByEmail(email);
    if (!userExists)
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ message: "User does not exist" });

    // check if password matches
    const passwordMatches = await bcrypt.compare(
      password,
      userExists.password as string
    );
    if (!passwordMatches) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "incorrect password" });
    }

    // generate access tokens if password match
    const accessToken = jwt.sign(
      { id: userExists.id },
      config.JWT_ACCESS_TOKEN,
      {
        expiresIn: config.EXPIRES_IN,
      }
    );

    // generate refresh tokens
    const refreshToken = jwt.sign(
      { id: userExists.id },
      config.JWT_REFRESH_TOKEN,
      {
        expiresIn: config.EXPIRES_IN,
      }
    );

    // update user data with refresh token
    await prisma.user.update({
      where: { id: userExists.id },
      data: { refreshToken: refreshToken },
    });

    return res
      .status(StatusCodes.OK)
      .json({ accessToken: accessToken, refreshToken: refreshToken });
  } catch (error: any) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

/**
 * change user password while user is logged in
 * @param req : request object containing old password, new password and user id
 * @param res : status code and message
 */
export const changePassword = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    const { oldPassword, newPassword, userId } = req.body;

    // get user details
    const user = await checkUserExistsById(userId);
    if (!user)
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ message: "User does not exist" });

    // compare user passwords
    const isPasswordCorrect = await bcrypt.compare(
      oldPassword,
      user.password as string
    );
    if (!isPasswordCorrect) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "incorrect password" });
    }

    // hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // update user details
    await prisma.user.update({
      where: { id: user.id },
      data: { password: newPasswordHash },
    });

    return res.status(StatusCodes.OK).json({ message: "password changed" });
  } catch (error: any) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

/**
 * send verification otp to user via email
 * @param req : request object containing the user id
 * @param res: response object
 */
export const sendVerificationOtp = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    const { userId } = req.body;

    const user = await checkUserExistsById(userId);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "user not found" });
    }

    // generate and send otp
    const otp = generateOtp();
    // create payload
    const message = { to: user.email, otp: otp };
    //send message to notification microservice to send email
    await publisher(message, "NOTIFICATION", "send-otp");

    // save otp to database
    await prisma.otp.create({ data: { otp: otp, userId: userId } });

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "verification otp sent" });
  } catch (error: any) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

/**
 * verify otp sent by user
 * @param req : request object containing the otp provided and user id
 * @param res: response object
 */
export const verifyUser = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    const { otpProvided, userId } = req.body;

    // get user details
    const user = await checkUserExistsById(userId);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "user not found" });
    }

    // get otp details
    const userOtp = await prisma.otp.findFirst({ where: { userId: user.id } });
    if (!userOtp) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "otp does not exist" });
    }

    // check if user otp and otp provided are the same
    if (otpProvided !== userOtp.otp) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "incorrect otp" });
    }

    // update user verification status
    await prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
    });

    //delete otp
    await prisma.otp.delete({ where: { id: userOtp.id } });

    return res.status(StatusCodes.OK).json({ message: "user verified" });
  } catch (error: any) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

/**
 * reset user password
 * @param req : request object containing new passowrd, otp and email
 * @param res : response objet
 */
export const resetPassword = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    const { newPassword, otpProvided, email } = req.body;

    // get user details
    const user = await checkUserExistsByEmail(email);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "user not found" });
    }

    // get current otp in database
    const userOtp = await prisma.otp.findFirst({ where: { userId: user.id } });
    if (!userOtp) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "otp does not exist" });
    }

    // check if user otp and otp provided are the same
    if (otpProvided !== userOtp.otp) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "incorrect otp" });
    }

    // hash new password and update password field in db
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    await prisma.user.update({
      where: { email: email },
      data: { password: newPasswordHash },
    });

    // delete otp after updating password
    await prisma.otp.delete({ where: { id: userOtp.id } });

    return res.status(StatusCodes.OK).json({ message: "password reset" });
  } catch (error: any) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

/**
 * send reset password otp to user
 * @param req
 * @param res
 */
export const sendResetPasswordOtp = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;

    // get user details
    const userExists = await checkUserExistsByEmail(email);
    if (!userExists) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "user not found" });
    }

    // generate and send otp
    const otp = generateOtp();

    // craete payload to send to notification service
    const payload = {
      to: userExists.email,
      otp: otp,
    };

    // send rquest to notification microservice to send email
    await publisher(payload, "NOTIFICATION", "send-otp");
    // save otp to database
    await prisma.otp.create({ data: { otp: otp, userId: userExists.id } });

    return res.status(StatusCodes.CREATED).json({ message: "reset otp sent" });
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
export const refreshAccessToken = async (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ message: "accesh token refreshed" });
};
