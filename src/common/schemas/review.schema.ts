import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';

@Schema()
class Review {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  comment: string;
}

const ReviewSchema = SchemaFactory.createForClass(Review);

type ReviewDocument = HydratedDocument<Review>;

export { Review, ReviewDocument, ReviewSchema };
