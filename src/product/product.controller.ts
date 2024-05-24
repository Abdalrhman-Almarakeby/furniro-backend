import { Controller, Post, Body } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from 'src/shared/dto/product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: ProductDto) {
    return this.productService.create(createProductDto);
  }
}
