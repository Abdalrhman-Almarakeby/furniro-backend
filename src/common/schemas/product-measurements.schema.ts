import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ _id: false })
class ProductMeasurements {
  @Prop({ required: true })
  width: string;

  @Prop({ required: true })
  height: string;

  @Prop({ required: true })
  length: string;
}

type ProductMeasurementsDocument = HydratedDocument<ProductMeasurements>;

const ProductMeasurementsSchema =
  SchemaFactory.createForClass(ProductMeasurements);

export {
  ProductMeasurements,
  ProductMeasurementsDocument,
  ProductMeasurementsSchema,
};
