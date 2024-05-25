import { PartialType } from '@nestjs/mapped-types';
import { ProductDto } from 'src/common/dto/product.dto';

export class UpdateProductDto extends PartialType(ProductDto) {}
