import logger from "../../helpers/logger";
import transporter from "../transporter";

// convert booking details to qr code
const sendBookingEmail = async (
  to: string,
  eventId: string,
  time: Date,
  location: string
) => {
  const mailOptions = {
    from: "alahirajeffrey@gmail.com",
    to: to,
    subject: "Booking details",
    text: "",
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

export default sendBookingEmail;
