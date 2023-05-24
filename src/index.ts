import server from "./server";
import * as dotenv from "dotenv";
dotenv.config();

const port: number = Number(process.env.PORT) || 5000;

server.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
