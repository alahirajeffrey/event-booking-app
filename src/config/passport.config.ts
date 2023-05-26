import passport from "passport";
import passportLocal from "passport-local";
import prisma from "./prisma.config";

const LocalStrategy = passportLocal.Strategy;
