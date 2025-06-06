import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Submission {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  producerId: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  djId: string;

  @Prop({ required: true })
  trackTitle: string;

  @Prop()
  trackDescription: string;

  @Prop({ default: false })
  hasUnreadMessage: boolean; 
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);
