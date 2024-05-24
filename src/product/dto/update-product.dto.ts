import { PartialType } from '@nestjs/mapped-types';
import { ProductDto } from 'src/shared/dto/product.dto';

export class UpdateProductDto extends PartialType(ProductDto) {}
