import { Test, TestingModule } from '@nestjs/testing';
import { EmailNotificationController } from './email-notification.controller';

describe('EmailNotificationController', () => {
  let controller: EmailNotificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailNotificationController],
    }).compile();

    controller = module.get<EmailNotificationController>(EmailNotificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
