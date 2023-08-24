import config from "./config/config.config";
import logger from "./helpers/logger";
import server from "./server";

server.listen(config.PORT, () => {
  logger.info(`server is listening on port ${config.PORT}`);
});
