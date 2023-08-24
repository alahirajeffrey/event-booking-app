import { createLogger, transports, format } from "winston";

const logger = createLogger({
  transports: [
    new transports.Console({}),
    new transports.File({
      dirname: "logs",
      filename: "logs.log",
    }),
  ],
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp} ${level}: ${message}]`;
    })
  ),
});

export default logger;
