import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ _id: false })
class PackagingInfo {
  @Prop({ required: true })
  numOfPackages: number;

  @Prop({ required: true })
  width: string;

  @Prop({ required: true })
  height: string;

  @Prop({ required: true })
  length: string;

  @Prop({ required: true })
  weight: string;
}

type PackagingInfoDocument = HydratedDocument<PackagingInfo>;

const PackagingInfoSchema = SchemaFactory.createForClass(PackagingInfo);

export { PackagingInfo, PackagingInfoDocument, PackagingInfoSchema };
