import express, { Express, Request, Response } from "express";
import authRouter from "./routes/auth.route";
import eventRouter from "./routes/event.route";

const server: Express = express();

server.use(express.json());

// setup routes here
server.use("/api/v1/auth/", authRouter);
server.use("/api/v1/event/", eventRouter);

server.get("/api/v1/", (req: Request, res: Response) => {
  return res.status(200).json({ message: "welcome" });
});

export default server;
