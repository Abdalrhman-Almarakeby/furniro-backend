import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ _id: false })
class PackagingInfo {
  @Prop()
  numOfPackages: number;

  @Prop()
  width: string;

  @Prop()
  height: string;

  @Prop()
  length: string;

  @Prop()
  weight: string;
}

type PackagingInfoDocument = HydratedDocument<PackagingInfo>;

const PackagingInfoSchema = SchemaFactory.createForClass(PackagingInfo);

export { PackagingInfo, PackagingInfoDocument, PackagingInfoSchema };
