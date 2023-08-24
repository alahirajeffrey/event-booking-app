import * as jwt from "jsonwebtoken";
import config from "../config/config.config";

/**
 * decode jwt token so as to get user id and check to see if a user owns a resource before performing an update or delete
 * @param token : access token
 */
const decodeToken = (token: string) => {
  const authToken = token.split(" ")[1];
  return jwt.verify(authToken, config.JWT_ACCESS_TOKEN, (err, user) => {
    if (err) return err;
    return user;
  });
};

export default decodeToken;
