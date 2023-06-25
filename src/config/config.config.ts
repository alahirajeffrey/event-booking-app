import dotenv from "dotenv";
dotenv.config();

const config = {
  JWT_SECRET: process.env.JWT_SECRET || "secret",
  EXPIRES_IN: process.env.EXPIRES_IN || "30m",
  NODE_ENV: process.env.NODE_ENV || "development",

  PORT: process.env.PORT || 5000,
};

export default config;
