import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from 'src/common/schemas/product.schema';
import { UpdateReviewDto } from 'src/common/dto/update-review.dto';
import { Review } from 'src/common/schemas/review.schema';
import { CreateReviewDto } from 'src/common/dto/create-review.dto';
import { UserService } from 'src/users/users.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    private readonly userServices: UserService,
  ) {}

  private async validateUserCanReview(
    product: ProductDocument,
    userId: string,
  ) {
    const user = await this.userServices.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.isVerified) {
      throw new ForbiddenException('Email is not verified');
    }

    // Validate that the user have no review on this product
    const reviews = product.toObject().reviews;

    const reviewFromSameUser = reviews.find(
      (review) => review.user.toString() === userId,
    );

    if (reviewFromSameUser) {
      throw new ConflictException('User already reviewed this product');
    }
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewModel.findById(id);

    if (!review) {
      throw new NotFoundException('Product not found');
    }

    return review.toObject();
  }

  async create(
    productId: string,
    createReviewDto: CreateReviewDto,
  ): Promise<Product> {
    const product = await this.productModel.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.validateUserCanReview(product, createReviewDto.user);

    const review = new this.reviewModel(createReviewDto);

    product.reviews.push(review);

    await review.save();

    const newProduct = await product.save();

    if (!newProduct) {
      throw new InternalServerErrorException();
    }

    return newProduct;
  }

  async update(
    productId: string,
    reviewId: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<Product> {
    const product = await this.productModel.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const review = product.reviews.id(reviewId);

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    Object.assign(review, updateReviewDto);

    const newProduct = await product.save();

    if (!newProduct) {
      throw new InternalServerErrorException();
    }

    return newProduct;
  }

  async remove(productId: string, reviewId: string): Promise<Product> {
    const product = await this.productModel.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const reviews = product.toObject().reviews;
    const reviewToDelete = reviews.find(
      (review) => review.id.toString() === reviewId,
    );

    if (!reviewToDelete) {
      throw new NotFoundException('Review not found');
    }

    await this.reviewModel.findByIdAndDelete(reviewId);

    const newProduct = await this.productModel.findByIdAndUpdate(
      productId,
      {
        reviews: reviews.filter((review) => review.id.toString() !== reviewId),
      },
      { new: true },
    );

    if (!newProduct) {
      throw new InternalServerErrorException();
    }

    return newProduct;
  }
}
