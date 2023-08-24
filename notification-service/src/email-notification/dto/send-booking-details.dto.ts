import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import EventStatusEnum from 'src/common/enums/event-status.enum';

export class SendBookingDetailsEmailDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  to: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  eventTitle: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  location: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  time: Date;

  @IsString()
  @ApiProperty()
  paymentId: string | null;

  @IsEnum(EventStatusEnum)
  @IsNotEmpty()
  @ApiProperty()
  subject: EventStatusEnum;
}
