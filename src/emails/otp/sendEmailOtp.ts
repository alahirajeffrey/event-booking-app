import { error } from "console";
import logger from "../../helpers/logger";
import transporter from "../transporter";

/**
 * function to send otp email
 * @param to : email of the reciepient
 * @param otp : otp to be sent
 */
const sendOtpEmail = async (to: string, otp: string) => {
  const mailOptions = {
    from: "alahirajeffrey@gmail.com",
    to: to,
    subject: "Verification Otp",
    text: `Hi there, Here is your verification otp ${otp}`,
  };

  await transporter
    .sendMail(mailOptions)
    .then((response) => {
      logger.info(`Email sent: ${response.response}`);
    })
    .catch((err) => {
      logger.error(err);
      throw error;
    });
};

export default sendOtpEmail;
