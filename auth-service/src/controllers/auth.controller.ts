import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import prisma from "../config/prisma.config";
import { ApiResponse } from "../types/response.type";

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
