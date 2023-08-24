import { Controller } from '@nestjs/common';
import { EmailNotificationService } from './email-notification.service';
import { SendOtpEmailDto } from './dto/send-otp.dto';
import { SendEventDetailsEmailDto } from './dto/send-event-details.dto';
import { SendPriceSetorUpdateEmail } from './dto/price-updated.dto';
import { SendBookingDetailsEmailDto } from './dto/send-booking-details.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('email-notification')
export class EmailNotificationController {
  constructor(private readonly emailService: EmailNotificationService) {}

  @MessagePattern('send-otp')
  async sendOtpEail(@Payload() dto: SendOtpEmailDto) {
    return this.emailService.sendOtpEmail(dto);
  }

  @MessagePattern('send-event-details')
  async sendEventDetailsEmail(@Payload() dto: SendEventDetailsEmailDto) {
    return this.emailService.sendEventDetailsEmail(dto);
  }

  @MessagePattern('send-price-update')
  async sendPriceSetorUpdateEmail(@Payload() dto: SendPriceSetorUpdateEmail) {
    return this.emailService.sendPriceSetorUpdateEmail(dto);
  }

  @MessagePattern('send-booking-details')
  async sendBookingDetailsEmail(@Payload() dto: SendBookingDetailsEmailDto) {
    return this.emailService.sendBookingDetailsEmail(dto);
  }
}
