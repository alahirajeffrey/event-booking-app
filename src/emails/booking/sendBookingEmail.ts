import logger from "../../helpers/logger";
import transporter from "../transporter";
import QRCode from "qrcode";

/**
 * send booking details via email
 * @param to : reciever email
 * @param eventTitle : title of the event
 * @param time : time of the event
 * @param location : location of the event
 * @param paymentId : payment id if the event is paid or null if it is free
 */
const sendBookingEmail = async (
  to: string,
  eventTitle: string,
  time: Date,
  location: string,
  paymentId: string | null
) => {
  const qrcEncodedMessage = QRCode.toDataURL(`${eventTitle} booked.
                                                Event date: ${time}.
                                                Location: ${location}
                                                PaymentId: ${paymentId}`);

  const mailOptions = {
    from: "alahirajeffrey@gmail.com",
    to: to,
    subject: "Booking details",
    attachDataUrls: true,
    text: `"<img src = ${qrcEncodedMessage}>`,
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
