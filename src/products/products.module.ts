import { Module } from '@nestjs/common';
import { ProductService } from './products.service';
import { ProductController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/common/schemas/product.schema';
import { Review, ReviewSchema } from 'src/common/schemas/review.schema';
import { User, UserSchema } from 'src/common/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { ReviewsController } from 'src/reviews/reviews.controller';
import { ReviewsService } from 'src/reviews/reviews.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Review.name, schema: ReviewSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ProductController, ReviewsController],
  providers: [ProductService, JwtService, ReviewsService],
})
export class ProductModule {}
