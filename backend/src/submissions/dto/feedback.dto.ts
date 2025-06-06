import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFeedbackDto {
  @ApiProperty({ description: 'DJ ID', example: '507f1f77bcf86cd799439011' })
  @IsString()
  @IsNotEmpty()
  djId: string;

  @ApiProperty({ description: 'Producer ID', example: '507f1f77bcf86cd799439012' })
  @IsString()
  @IsNotEmpty()
  producerId: string;

  @ApiProperty({ description: 'Feedback content', example: 'Great track but needs better mixing' })
  @IsString()
  @IsNotEmpty()
  content: string;
}