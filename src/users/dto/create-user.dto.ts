import {
  IsEmail,
  IsInt,
  Max,
  MaxLength,
  Min,
  MinLength,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  password: string;

  @IsInt()
  @Min(18)
  @Max(100)
  age: number;
}
