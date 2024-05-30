import { IsDimension } from 'src/common/validators';

export class ProductMeasurements {
  @IsDimension()
  width: string;

  @IsDimension()
  height: string;

  @IsDimension()
  length: string;
}
