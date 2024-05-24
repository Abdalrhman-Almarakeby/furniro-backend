import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Categories } from 'src/common/enums/categories.enum';
import { Color } from './color.dto';
import { PackagingInfo } from './packaging-info.dto';
import { ProductMeasurements } from './product-measurements.dto';

export class ProductDto {
  @IsString()
  productName: string;

  @IsNumber()
  @Min(0)
  originalPrice: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discountPrice: number;

  @IsInt()
  @Min(1000)
  @Max(9999)
  sku: number;

  @IsArray()
  @IsEnum(Categories, { each: true })
  category: string[];

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Color)
  availableColors: Color[];

  @IsObject()
  @ValidateNested()
  @Type(() => ProductMeasurements)
  measurements: ProductMeasurements;

  @IsObject()
  @ValidateNested()
  @Type(() => PackagingInfo)
  packagingInfo: PackagingInfo;
}
