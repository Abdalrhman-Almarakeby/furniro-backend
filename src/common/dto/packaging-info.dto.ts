import { IsNumber, Min } from 'class-validator';
import { IsValidDimension, IsValidWeight } from 'src/common/validators';

export class PackagingInfo {
  @IsNumber()
  @Min(1)
  numOfPackages: number;

  @IsValidDimension()
  width: string;

  @IsValidDimension()
  height: string;

  @IsValidDimension()
  length: string;

  @IsValidWeight()
  weight: string;
}
