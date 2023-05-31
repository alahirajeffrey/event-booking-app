import { error } from "console";
import logger from "../../helpers/logger";
import transporter from "../transporter";

enum EventStatusEnum {
  Created = "created",
  Updated = "updated",
  Deleted = "deleted",
}

/**
 * function to send otp email
 * @param to : email of the reciepient
 * @param otp : otp to be sent
 */
const sendOtpEmail = async (
  to: string,
  eventId: string,
  time: Date,
  location: string,
  eventStatus: EventStatusEnum
) => {
  const mailOptions = {
    from: "alahirajeffrey@gmail.com",
    to: to,
    subject: "Event created",
    text: `Hi there, Your event has been ${eventStatus}. 
    
            Event id : ${eventId}
            
            Time: ${time}
            
            location: ${location}`,
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
