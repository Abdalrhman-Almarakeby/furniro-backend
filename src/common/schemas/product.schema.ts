import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Categories } from 'src/common/enums/categories.enum';
import { Color } from './color.schema';
import { PackagingInfo } from './packagingInfo.schema';
import { ProductMeasurements } from './product-measurements.schema';
import { Review, ReviewSchema } from './review.schema';

@Schema({ timestamps: true })
class Product {
  @Prop()
  productName: string;

  @Prop()
  originalPrice: number;

  @Prop()
  discountPrice: number;

  @Prop({
    type: Number,
    min: 1000,
    max: 9999,
  })
  sku: number;

  @Prop({
    type: [String],
    enum: Categories,
  })
  category: string[];

  @Prop({ type: [Color] })
  availableColors: Color[];

  @Prop({ type: ProductMeasurements })
  measurements: ProductMeasurements;

  @Prop()
  description: string;

  @Prop()
  details: string;

  @Prop({ type: PackagingInfo })
  packagingInfo: PackagingInfo;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: [ReviewSchema], default: [] })
  reviews: Types.DocumentArray<Review>;
}

type ProductDocument = HydratedDocument<Product>;

const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.pre<Product>('save', function (next) {
  if (this.discountPrice) return next();

  this.discountPrice = this.originalPrice;

  next();
});

ProductSchema.virtual('hasDiscount').get(function () {
  return this.discountPrice !== this.originalPrice;
});

ProductSchema.virtual('discountPercentage').get(function () {
  const discountAmount: number = this.originalPrice - this.discountPrice;

  return (discountAmount / this.originalPrice) * 100;
});

ProductSchema.virtual('isNew').get(function () {
  const dayInMS = 24 * 60 * 60 * 1000;

  const MAX_TIME_TO_BE_NEW = 30 * dayInMS;
  return this.createdAt >= new Date(Date.now() - MAX_TIME_TO_BE_NEW);
});

ProductSchema.set('toJSON', {
  virtuals: true,
});

ProductSchema.set('toObject', {
  virtuals: true,
});

export { Product, ProductDocument, ProductSchema };
