import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';

@Schema()
export class Review {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  comment: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

export type ReviewDocument = HydratedDocument<Review>;
