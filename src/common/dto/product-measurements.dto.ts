import { IsValidDimension } from 'src/common/validators';

export class ProductMeasurements {
  @IsValidDimension()
  width: string;

  @IsValidDimension()
  height: string;

  @IsValidDimension()
  length: string;
}
