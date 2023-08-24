import { Module } from '@nestjs/common';
import { EmailNotificationModule } from './email-notification/email-notification.module';
import { EmailNotificationController } from './email-notification/email-notification.controller';
import { EmailNotificationService } from './email-notification/email-notification.service';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

@Module({
  imports: [
    EmailNotificationModule,
    ConfigModule.forRoot({ isGlobal: true }),
    WinstonModule.forRoot({
      // options
      transports: [
        new winston.transports.Console({}),
        new winston.transports.File({
          dirname: 'logs',
          filename: 'logs.log',
        }),
      ],
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `[${timestamp} ${level}: ${message}]`;
        }),
      ),
    }),
  ],
  controllers: [EmailNotificationController],
  providers: [EmailNotificationService],
})
export class AppModule {}
