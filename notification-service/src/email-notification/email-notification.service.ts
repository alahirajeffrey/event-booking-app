import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import * as qrcode from 'qrcode';
import { SendOtpEmailDto } from './dto/send-otp.dto';
import { SendEventDetailsEmailDto } from './dto/send-event-details.dto';
import { SendBookingDetailsEmailDto } from './dto/send-booking-details.dto';
import { SendPriceSetorUpdateEmail } from './dto/price-updated.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class EmailNotificationService {
  private nodeMailerTransport: Mail;
  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    //setup mail service provider
    this.nodeMailerTransport = createTransport({
      service: configService.get('EMAIL_SERVICE'),
      auth: {
        type: 'OAuth2',
        user: configService.get('USER_EMAIL'),
        clientId: configService.get('EMAIL_CLIENT_ID'),
        clientSecret: configService.get('EMAIL_CLIENT_SECRET'),
        refreshToken: configService.get('EMAIL_REFRESH_TOKEN'),
      },
    });
  }
  /**
   * function to send otp email
   * @param dto : send email dto
   */
  async sendOtpEmail(dto: SendOtpEmailDto) {
    const mailOptions = {
      from: 'alahirajeffrey@gmail.com',
      to: dto.to,
      subject: 'Verification Otp',
      text: `Hi there, Here is your verification otp ${dto.otp}`,
    };

    await this.nodeMailerTransport
      .sendMail(mailOptions)
      .then((response) => {
        this.logger.info(`Email sent: ${response.response}`);
      })
      .catch((error) => {
        this.logger.error(error);
        throw error;
      });
  }

  /**
   * function to send event details
   * @param dto: send event details dto
   */
  sendEventDetailsEmail = async (dto: SendEventDetailsEmailDto) => {
    const mailOptions = {
      from: 'alahirajeffrey@gmail.com',
      to: dto.to,
      subject: `Event ${dto.eventStatus}`,
      text: `Hi there, Your event has been ${dto.eventStatus}. 
    
            Event id : ${dto.eventId}
            
            Time: ${dto.time}
            
            location: ${dto.location}`,
    };

    await this.nodeMailerTransport
      .sendMail(mailOptions)
      .then((response) => {
        this.logger.info(`Email sent: ${response.response}`);
      })
      .catch((err) => {
        this.logger.error(err);
        throw err;
      });
  };

  /**
   * function to send otp email
   * @param dto: send price set or updated email
   * @param to : email of the reciepient
   * @param eventId : id of the event
   */
  sendPriceSetorUpdateEmail = async (dto: SendPriceSetorUpdateEmail) => {
    const mailOptions = {
      from: 'alahirajeffrey@gmail.com',
      to: dto.to,
      subject: 'Seat Price Updated',
      text: `Hi there, The seat price for your event with id: ${dto.eventId} has been updated.`,
    };

    await this.nodeMailerTransport
      .sendMail(mailOptions)
      .then((response) => {
        this.logger.info(`Email sent: ${response.response}`);
      })
      .catch((err) => {
        this.logger.error(err);
        throw err;
      });
  };

  /**
   * send booking details via email
   * @param dto: send booking details email
   */
  sendBookingDetailsEmail = async (dto: SendBookingDetailsEmailDto) => {
    const emailString = `${dto.eventTitle} booked. \nEvent date: ${dto.time}. \nLocation: ${dto.location}. \nPaymentId: ${dto.paymentId}`;

    const qrcEncodedMessage = await qrcode.toDataURL(emailString);

    const mailOptions = {
      from: 'alahirajeffrey@gmail.com',
      to: dto.to,
      subject: `Booking ${dto.subject}`,
      attachDataUrls: true,
      html: `<p>Scan the QR code to view your booking details</p>
          <br>
          <img src=${qrcEncodedMessage}>`,
    };

    await this.nodeMailerTransport
      .sendMail(mailOptions)
      .then((response) => {
        this.logger.info(`Email sent: ${response.response}`);
      })
      .catch((err) => {
        this.logger.error(err);
        throw err;
      });
  };
}
