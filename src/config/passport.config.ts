import prisma from "./prisma.config";
import { ExtractJwt, Strategy } from "passport-jwt";
import passport from "passport";
import config from "../config/config.config";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.JWT_ACCESS_TOKEN,
};

// setup jwt passport strategy
passport.use(
  new Strategy(opts, async (jwtPayload, done) => {
    const user = await prisma.user.findFirstOrThrow({
      where: { id: jwtPayload.id },
    });
    if (user) {
      return done(null, user);
    }
  })
);
