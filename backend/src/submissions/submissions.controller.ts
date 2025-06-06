import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { Submission } from '../schemas/Submission.schema';
import { Message } from '../schemas/Message.schema';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/submission.dto';
import { CreateFeedbackDto } from './dto/feedback.dto';

@ApiTags('submissions')
@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new track' })
  @ApiBody({ type: CreateSubmissionDto })
  @ApiResponse({ status: 201, description: 'Track submission created', type: Submission })
  async sendTrack(@Body() createSubmissionDto: CreateSubmissionDto): Promise<Submission> {
    return this.submissionsService.sendTrack(createSubmissionDto);
  }

  @Get('getAllTracks')
  @ApiOperation({ summary: 'Get all track submissions' })
  @ApiResponse({ status: 200, description: 'List of all track submissions', type: [Submission] })
  async getAllTracks(): Promise<Submission[]> {
    return this.submissionsService.getAllTracks();
  }

  @Get('getMessages/:id')
  @ApiOperation({ summary: 'Get messages for a submission' })
  @ApiParam({ name: 'id', description: 'Submission ID' })
  @ApiResponse({ status: 200, description: 'List of messages', type: [Message] })
  async getMessages(@Param('id') id: string): Promise<Message[]> {
    return this.submissionsService.getMessages(id);
  }

  @Post('feedback/:id')
  @ApiOperation({ summary: 'Send feedback for a submission' })
  @ApiParam({ name: 'id', description: 'Submission ID' })
  @ApiBody({ type: CreateFeedbackDto })
  @ApiResponse({ status: 201, description: 'Feedback message created', type: Message })
  async sendFeedback(
    @Param('id') submissionId: string,
    @Body() createFeedbackDto: CreateFeedbackDto,
  ): Promise<Message> {
    return this.submissionsService.sendFeedback(submissionId, createFeedbackDto);
  }

  @Put('read/:id')
  @ApiOperation({ summary: 'Mark submission as read by DJ' })
  @ApiParam({ name: 'id', description: 'Submission ID' })
  @ApiResponse({ status: 200, description: 'Submission marked as read', type: Submission })
  async markRead(@Param('id') id: string): Promise<Submission> {
    return this.submissionsService.markRead(id);
  }
}