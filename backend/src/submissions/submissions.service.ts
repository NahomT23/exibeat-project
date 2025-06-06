import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Submission } from '../schemas/Submission.schema';
import { Message } from '../schemas/Message.schema';
import { CreateSubmissionDto } from './dto/submission.dto';
import { CreateFeedbackDto } from './dto/feedback.dto';


@Injectable()
export class SubmissionsService {
  constructor(
    @InjectModel(Submission.name) private submissionModel: Model<Submission>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}


  async sendTrack(dto: CreateSubmissionDto): Promise<Submission> {
    const { producerId, djId, trackTitle, trackDescription, initialMessage } = dto;

    const submission = await this.submissionModel.create({
      producerId: new Types.ObjectId(producerId),
      djId: new Types.ObjectId(djId),
      trackTitle,
      trackDescription: trackDescription || '',
      hasUnreadMessage: !!initialMessage,
    });

    if (initialMessage) {
      await this.messageModel.create({
        submission: submission._id,
        senderId: producerId,
        recipientId: djId,
        content: initialMessage,
        timestamp: new Date(),
        isReadByRecipient: false,
      });
    }

    return submission;
  }

  async getAllTracks(): Promise<Submission[]> {
    return this.submissionModel.find().exec();
  }


  async getMessages(submissionId: string): Promise<Message[]> {
    

    const submission = await this.submissionModel.findById(submissionId).exec();
    if (!submission) {
      throw new NotFoundException(`Submission with id ${submissionId} not found.`);
    }

    return this.messageModel
      .find({ submission: new Types.ObjectId(submissionId) })
      .sort({ timestamp: 1 })
      .exec();
  }

  async sendFeedback(submissionId: string, dto: CreateFeedbackDto): Promise<Message> {

    const submission = await this.submissionModel.findById(submissionId).exec();
    if (!submission) {
      throw new NotFoundException(`Submission with id ${submissionId} not found.`);
    }

    const feedbackMessage = await this.messageModel.create({
      submission: submission._id,
      senderId: dto.djId,
      recipientId: dto.producerId,
      content: dto.content,
      timestamp: new Date(),
      isReadByRecipient: false,
    });

    return feedbackMessage;
  }


  async markRead(submissionId: string): Promise<Submission> {
    const submission = await this.submissionModel.findById(submissionId).exec();
    if (!submission) {
      throw new NotFoundException(`Submission with id ${submissionId} not found.`);
    }

    submission.hasUnreadMessage = false;
    await submission.save();


    await this.messageModel.updateMany(
      {
        submission: submission._id,
        recipientId: submission.djId.toString(),
        isReadByRecipient: false,
      },
      { $set: { isReadByRecipient: true } },
    ).exec();

    return submission;
  }
}
