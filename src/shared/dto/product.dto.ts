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
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Categories } from 'src/common/enums/categories.enum';
import { Color } from './color.dto';
import { PackagingInfo } from './packagingInfo.dto';

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

  // TODO: Add proper measurements validation
  @IsString()
  @MinLength(10)
  @MaxLength(20)
  measurements: string;

  @IsObject()
  @ValidateNested()
  @Type(() => PackagingInfo)
  packagingInfo: PackagingInfo;
}
