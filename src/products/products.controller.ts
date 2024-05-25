import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './products.service';
import { ProductDto } from 'src/common/dto/product.dto';
import { ObjectIdValidationPipe } from 'src/common/pipes/object-id-validation.pipe';
import { Product } from 'src/common/schemas/product.schema';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateReviewDto } from 'src/common/dto/create-review.dto';
import { UpdateReviewDto } from 'src/common/dto/update-review.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Post()
  async create(@Body() createProductDto: ProductDto): Promise<Product> {
    return this.productService.create(createProductDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  async remove(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<Product> {
    return this.productService.remove(id);
  }

  @Post(':id/reviews')
  async addReview(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.productService.addReview(id, createReviewDto);
  }

  @UseGuards(AuthGuard)
  @Patch(':productId/reviews/:reviewId')
  async updateReview(
    @Param('productId', ObjectIdValidationPipe) productId: string,
    @Param('reviewId', ObjectIdValidationPipe) reviewId: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.productService.updateReview(
      productId,
      reviewId,
      updateReviewDto,
    );
  }

  @UseGuards(AuthGuard)
  @Delete(':productId/reviews/:reviewId')
  async deleteReview(
    @Param('productId') productId: string,
    @Param('reviewId') reviewId: string,
  ) {
    return this.productService.deleteReview(productId, reviewId);
  }
}
