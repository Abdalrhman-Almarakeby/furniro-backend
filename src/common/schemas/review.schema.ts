import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';

@Schema()
export class Review extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name })
  user: Types.ObjectId;

  @Prop()
  rating: number;

  @Prop()
  comment: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

ReviewSchema.set('toJSON', {
  virtuals: true,
});

ReviewSchema.set('toObject', {
  virtuals: true,
});

export type ReviewDocument = HydratedDocument<Review>;
