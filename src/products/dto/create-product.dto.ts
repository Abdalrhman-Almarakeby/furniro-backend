import { IsNotEmpty, IsString } from 'class-validator';
import { ProductDto } from 'src/common/dto/product.dto';
import { IsJsonString } from 'src/common/validators';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @IsJsonString(ProductDto)
  data: string;
}
