import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import prisma from "../config/prisma.config";
import { ApiResponse } from "../types/response.type";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || "access_secret";
const REFRESH_TOKEN_SECRET = process.env.JWT_SECRET || "refresh_secret";
const ACCESS_EXPIRESIN = process.env.EXPIRESIN || "15m";
const REFRESH_EXPIRESIN = process.env.EXPIRESIN || "1d";

/**
 * checks if a user exists or not by email
 * @param email : string
 * @returns : user object or null
 */
const checkUserExistsByEmail = async (email: string) => {
  return await prisma.user.findFirst({ where: { email: email } });
};

/**
 * checks if a user exists or not by id
 * @param id : string
 * @returns : user object or null
 */
const checkUserExistsById = async (id: string) => {
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
    const passwordMatches = await bcrypt.compare(password, userExists.password);
    if (!passwordMatches) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "incorrect password" });
    }

    // generate access tokens if password match
    const accessToken = jwt.sign({ id: userExists.id }, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_EXPIRESIN,
    });

    // generate refresh tokens
    const refreshToken = jwt.sign({ id: userExists.id }, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_EXPIRESIN,
    });

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
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { userId } = req.params;

    // get user details
    const user = await checkUserExistsById(userId);
    if (!user)
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ message: "User does not exist" });

    // compare user passwords
    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
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
  res.status(StatusCodes.OK).json({ message: "password changed" });
};

/**
 * send verification otp to user via email
 * @param req
 * @param res
 */
export const sendVerificationOtp = (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ message: "verification otp sent" });
};

/**
 * verify otp sent by user
 * @param req
 * @param res
 */
export const verifyUser = (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ message: "user verified" });
};

/**
 * refresh access token
 * @param req
 * @param res
 */
export const refreshAccessToken = async (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ message: "accesh token refreshed" });
};
/**
 * reset user password
 * @param req
 * @param res
 */
export const forgotPassword = async (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ message: "password changed" });
};
