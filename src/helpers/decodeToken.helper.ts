import * as jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || "access_secret";

/**
 * decode jwt token so as to get user id and check to see if a user owns a resource before performing an update or delete
 * @param token : access token
 */
const decodeToken = (token: string) => {
  const authToken = token.split(" ")[1];
  return jwt.verify(authToken, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return err;
    return user;
  });
};

export default decodeToken;
