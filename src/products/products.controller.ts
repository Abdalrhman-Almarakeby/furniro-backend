import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductService } from './products.service';
import { ProductDto } from 'src/common/dto/product.dto';
import { ObjectIdValidationPipe } from 'src/common/pipes/object-id-validation.pipe';
import { Product } from 'src/common/schemas/product.schema';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(): Promise<Product[]> {
    const products = await this.productService.findAll();

    return products;
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
}
