import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Categories } from 'src/common/enums/categories.enum';
import { Color } from './color.schema';
import { PackagingInfo } from './packaging-info.schema';
import { ProductMeasurements } from './product-measurements.schema';
import { Review, ReviewSchema } from './review.schema';

@Schema({ timestamps: true })
class Product {
  @Prop({ require: true })
  productName: string;

  @Prop({ require: true })
  originalPrice: number;

  @Prop({ require: true })
  discountPrice: number;

  @Prop({
    type: Number,
    min: 1000,
    max: 9999,
    require: true,
  })
  sku: number;

  @Prop({
    type: [String],
    enum: Categories,
    require: true,
  })
  category: string[];

  @Prop({ type: [Color], require: true })
  availableColors: Color[];

  @Prop({ type: ProductMeasurements, require: true })
  measurements: ProductMeasurements;

  @Prop({ require: true })
  description: string;

  @Prop({ require: true })
  details: string;

  @Prop({ type: PackagingInfo, require: true })
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

ProductSchema.pre('find', function (next) {
  this.populate('reviews.user');

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

export { Product, ProductDocument, ProductSchema };
