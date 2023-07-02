import prisma from "./prisma.config";
import { ExtractJwt, Strategy } from "passport-jwt";
import passport from "passport";
import config from "../config/config.config";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

// Configure Google OAuth2 strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: "your-client-id",
      clientSecret: "your-client-secret",
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Add your logic to handle the user's profile data and authentication
      // You can store the user in your database or perform any necessary actions
      console.log(profile);
      done(null, profile);
    }
  )
);

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
