import { PartialType, OmitType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';
import { Address } from 'src/common/dto/address.dto';

export class UpdateUserDto extends OmitType(PartialType(CreateUserDto), [
  'email',
  'password',
]) {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Address)
  addresses: Address[];

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(40)
  displayName: string;
}
