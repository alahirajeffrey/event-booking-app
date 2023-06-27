import dotenv from "dotenv";
dotenv.config();

const config = {
  JWT_SECRET: process.env.JWT_SECRET || "secret",
  EXPIRES_IN: process.env.EXPIRES_IN || "30m",
  NODE_ENV: process.env.NODE_ENV || "development",

  PORT: process.env.PORT || 5000,

  OAUTH_CLIENT_ID: process.env.OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET: process.env.OAUTH_CLIENT_SECRET,
  OAUTH_REFRESH_TOKEN: process.env.OAUTH_REFRESH_TOKEN,
  OAUTH_REDIRECT_BASE_URI: process.env.OAUTH_REDIRECT_BASE_URI,

  RABBITMQ_URL: process.env.RABBITMQ_URL,
};

export default config;
