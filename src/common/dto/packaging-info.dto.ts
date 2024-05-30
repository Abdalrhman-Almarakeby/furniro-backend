import { IsNumber, Min } from 'class-validator';
import { IsDimension, IsWeight } from 'src/common/validators';

export class PackagingInfo {
  @IsNumber()
  @Min(1)
  numOfPackages: number;

  @IsDimension()
  width: string;

  @IsDimension()
  height: string;

  @IsDimension()
  length: string;

  @IsWeight()
  weight: string;
}
