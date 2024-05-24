import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ _id: false })
class ProductMeasurements {
  @Prop()
  width: string;

  @Prop()
  height: string;

  @Prop()
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
