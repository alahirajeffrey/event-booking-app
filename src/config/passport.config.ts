import prisma from "./prisma.config";
import { ExtractJwt, Strategy } from "passport-jwt";
import passport from "passport";

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || "access_secret";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: ACCESS_TOKEN_SECRET,
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
