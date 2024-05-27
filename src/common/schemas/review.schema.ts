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
