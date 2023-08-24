import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';
import EventStatusEnum from 'src/common/enums/event-status.enum';

export class SendEventDetailsEmailDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  to: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty()
  eventId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  location: string;

  @IsEnum(EventStatusEnum)
  @IsNotEmpty()
  @ApiProperty()
  eventStatus: EventStatusEnum;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  time: Date;
}
