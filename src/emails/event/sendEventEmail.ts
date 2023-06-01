import logger from "../../helpers/logger";
import transporter from "../transporter";

export enum EventStatusEnum {
  Created = "created",
  Updated = "updated",
  Deleted = "deleted",
}

/**
 * function to send otp email
 * @param to : email of the reciepient
 * @param eventId : id of the event
 * @param time : date and time of the event
 * @param location : location of the  event
 * @param eventStatus : status of the event i.e created, updated, deleted
 */
const sendEventEmail = async (
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
      throw err;
    });
};

/**
 * function to send otp email
 * @param to : email of the reciepient
 * @param eventId : id of the event
 */
export const sendPriceSetorUpdateEmail = async (
  to: string,
  eventId: string
) => {
  const mailOptions = {
    from: "alahirajeffrey@gmail.com",
    to: to,
    subject: "Event created",
    text: `Hi there, 
    
    The seat price for your event with id: ${eventId} has been updated.`,
  };

  await transporter
    .sendMail(mailOptions)
    .then((response) => {
      logger.info(`Email sent: ${response.response}`);
    })
    .catch((err) => {
      logger.error(err);
      throw err;
    });
};

export default sendEventEmail;
