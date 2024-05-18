import {
  IsAlphanumeric,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  @IsAlphanumeric()
  name: string;

  @IsInt()
  @Min(18)
  @Max(100)
  age: number;
}
