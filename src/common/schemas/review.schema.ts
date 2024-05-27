import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema()
class Review {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: Types.ObjectId;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  comment: string;
}

const ReviewSchema = SchemaFactory.createForClass(Review);

type ReviewDocument = HydratedDocument<Review>;

export { Review, ReviewDocument, ReviewSchema };
