import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductService } from './products.service';
import { ObjectIdValidationPipe } from 'src/common/pipes/object-id-validation.pipe';
import { Product } from 'src/common/schemas/product.schema';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';

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
  @UseInterceptors(FilesInterceptor('images', 10))
  async createProduct(
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productService.create({ images, createProductDto });
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
