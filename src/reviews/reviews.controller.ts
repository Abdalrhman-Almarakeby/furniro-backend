import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ObjectIdValidationPipe } from 'src/common/pipes/object-id-validation.pipe';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CreateReviewDto } from 'src/common/dto/create-review.dto';
import { UpdateReviewDto } from 'src/common/dto/update-review.dto';
import { ReviewsService } from './reviews.service';

@Controller('products')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post(':id/reviews')
  async addReview(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.create(id, createReviewDto);
  }

  @UseGuards(AuthGuard)
  @Patch(':productId/reviews/:reviewId')
  async updateReview(
    @Param('productId', ObjectIdValidationPipe) productId: string,
    @Param('reviewId', ObjectIdValidationPipe) reviewId: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(productId, reviewId, updateReviewDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':productId/reviews/:reviewId')
  async deleteReview(
    @Param('productId') productId: string,
    @Param('reviewId') reviewId: string,
  ) {
    return this.reviewsService.remove(productId, reviewId);
  }
}
