import axios from "axios";
import logger from "./logger";

const EMAIL_API_KEY = process.env.elasticEmailApiKey;
const EMAIL_BASE_URL = process.env.elasticEmailBaseUrl;

/**
 * function to send emails using the elastic email api
 * @param recieverEmail : email of the reciever
 * @param emailTitle : title of the email
 * @param emailContent : content of email
 * @param emailFrom : email sender
 */
const sendEmail = async (
  recieverEmail: string,
  emailTitle: string,
  emailContent: string,
  emailFrom: string
) => {
  try {
    const response = await axios.post(
      `${EMAIL_BASE_URL}/send?apikey=${EMAIL_API_KEY}&from=${emailFrom}&to=${recieverEmail}&subject=${emailTitle}&bodyText=${emailContent}`
    );
    logger.info(response.status);
    return response;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

export default sendEmail;
