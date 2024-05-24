import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ _id: false })
class Color {
  @Prop()
  hexCode: string;

  @Prop()
  name: string;
}

type ColorDocument = HydratedDocument<Color>;

const ColorSchema = SchemaFactory.createForClass(Color);

export { Color, ColorDocument, ColorSchema };
