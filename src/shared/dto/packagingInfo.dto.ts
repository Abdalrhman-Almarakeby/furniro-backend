import { IsNumber, IsString, Min } from 'class-validator';

export class PackagingInfo {
  @IsNumber()
  @Min(1)
  numOfPackages: number;

  @IsString()
  width: string;

  @IsString()
  height: string;

  @IsString()
  length: string;

  @IsString()
  weight: string;
}
