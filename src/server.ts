import express, { Express, Request, Response } from "express";

const server: Express = express();

server.use(express.json());

// setup routes here

server.get("/api/v1/", (req: Request, res: Response) => {
  return res.status(200).json({ message: "welcome" });
});

export default server;
