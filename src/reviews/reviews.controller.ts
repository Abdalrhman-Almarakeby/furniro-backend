import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { ObjectIdValidationPipe } from 'src/common/pipes/object-id-validation.pipe';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CreateReviewDto } from 'src/common/dto/create-review.dto';
import { UpdateReviewDto } from 'src/common/dto/update-review.dto';
import { ReviewsService } from './reviews.service';
import { UserDocument } from 'src/common/schemas/user.schema';

@Controller('products')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(AuthGuard)
  @Post(':id/reviews')
  async addReview(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() createReviewDto: CreateReviewDto,
    @Request() req: Request & { user: { sub: UserDocument } },
  ) {
    const user = req.user.sub;

    if (user.id !== createReviewDto.user) {
      throw new ForbiddenException();
    }

    return this.reviewsService.create(id, createReviewDto);
  }

  @UseGuards(AuthGuard)
  @Patch(':productId/reviews/:reviewId')
  async updateReview(
    @Param('productId', ObjectIdValidationPipe) productId: string,
    @Param('reviewId', ObjectIdValidationPipe) reviewId: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @Request() req: Request & { user: { sub: UserDocument } },
  ) {
    const user = req.user.sub;
    const review = await this.reviewsService.findOne(reviewId);

    if (user.id !== review.user) {
      throw new ForbiddenException();
    }

    return this.reviewsService.update(productId, reviewId, updateReviewDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':productId/reviews/:reviewId')
  async deleteReview(
    @Param('productId') productId: string,
    @Param('reviewId') reviewId: string,
    @Request() req: Request & { user: { sub: UserDocument } },
  ) {
    const user = req.user.sub;
    const review = await this.reviewsService.findOne(reviewId);

    if (user.id !== review.user) {
      throw new ForbiddenException();
    }

    return this.reviewsService.remove(productId, reviewId);
  }
}
