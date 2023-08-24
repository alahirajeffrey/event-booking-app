import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SendPriceSetorUpdateEmail {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  to: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty()
  eventId: string;
}
