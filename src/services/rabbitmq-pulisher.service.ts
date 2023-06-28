import * as amqplib from "amqplib";
import config from "../config/config.config";
import logger from "../helpers/logger";

export const sendMessage = async (
  data: object,
  queueName: string,
  messagePattern: string
) => {
  try {
    const connection = await amqplib.connect(`${config.RABBITMQ_URL}`);
    const channel = await connection.createChannel();

    const payload = {
      pattern: messagePattern,
      data: data,
    };

    // await channel.assertQueue(queueName);
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(payload)));
    await channel.close();
    await connection.close();
  } catch (error) {
    logger.error(error);
    throw error;
  }
};
