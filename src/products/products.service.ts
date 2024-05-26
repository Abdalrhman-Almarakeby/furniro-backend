import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductDto } from 'src/common/dto/product.dto';
import { Product, ProductDocument } from 'src/common/schemas/product.schema';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateReviewDto } from 'src/common/dto/update-review.dto';
import { Review } from 'src/common/schemas/review.schema';
import { CreateReviewDto } from 'src/common/dto/create-review.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Review.name) private reviewModel: Model<Review>,
  ) {}

  private async checkIfProductExists(
    productName: string,
    sku: number,
  ): Promise<void> {
    const existingProduct = await this.productModel.findOne({
      $or: [{ productName }, { sku }],
    });

    if (!existingProduct) return;

    if (existingProduct.productName === productName) {
      throw new BadRequestException('Product with this name already exists');
    }
    if (existingProduct.sku === sku) {
      throw new BadRequestException('Product with this SKU already exists');
    }
  }

  async findAll(): Promise<Product[]> {
    const productDocuments = await this.productModel.find().exec();

    return productDocuments.map((product) => product.toObject());
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).populate({
      path: 'reviews.user',
      model: 'User',
    });

    if (!product) {
      throw new NotFoundException('Product hhhhhh not found');
    }

    return product.toObject();
  }

  async create(createProductDto: ProductDto) {
    await this.checkIfProductExists(
      createProductDto.productName,
      createProductDto.sku,
    );

    const newProduct = await this.productModel.create(createProductDto);

    return newProduct.toObject();
  }

  async update(id: string, updateUserDto: UpdateProductDto): Promise<Product> {
    const product = await this.productModel.findByIdAndUpdate(
      id,
      updateUserDto,
      {
        new: true,
      },
    );

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async remove(id: string): Promise<Product> {
    const product = await this.productModel.findByIdAndDelete(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async addReview(
    productId: string,
    createReviewDto: CreateReviewDto,
  ): Promise<Product> {
    const product = await this.productModel.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    this.validateUserCanReview(product, createReviewDto.user);

    const review = new this.reviewModel(createReviewDto);

    product.reviews.push(review);

    await review.save();

    const newProduct = await product.save();

    if (!newProduct) {
      throw new InternalServerErrorException();
    }

    return newProduct.populate({
      path: 'reviews.user',
      model: 'User',
    });
  }

  private validateUserCanReview(product: ProductDocument, userId: string) {
    const reviews = product.toObject().reviews;

    const reviewFromSameUser = reviews.find(
      (review) => review.user.toString() === userId,
    );

    if (reviewFromSameUser) {
      throw new BadRequestException('User already reviewed this product ');
    }
  }

  async updateReview(
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

    return newProduct.populate({
      path: 'reviews.user',
      model: 'User',
    });
  }

  async deleteReview(productId: string, reviewId: string): Promise<Product> {
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

    return newProduct.populate({
      path: 'reviews.user',
      model: 'User',
    });
  }
}
