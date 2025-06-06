import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubmissionDto {
  @ApiProperty({ description: 'Producer ID', example: '507f1f77bcf86cd799439011' })
  @IsString()
  @IsNotEmpty()
  producerId: string;

  @ApiProperty({ description: 'DJ ID', example: '507f1f77bcf86cd799439012' })
  @IsString()
  @IsNotEmpty()
  djId: string;

  @ApiProperty({ description: 'Track title', example: 'Summer Vibes' })
  @IsString()
  @IsNotEmpty()
  trackTitle: string;

  @ApiProperty({ 
    description: 'Track description (optional)', 
    example: 'Chill tropical house track',
    required: false 
  })
  @IsString()
  @IsOptional()
  trackDescription?: string;

  @ApiProperty({ 
    description: 'Initial message (optional)', 
    example: 'Hope you like this new track!',
    required: false 
  })
  @IsString()
  @IsOptional()
  initialMessage?: string;
}