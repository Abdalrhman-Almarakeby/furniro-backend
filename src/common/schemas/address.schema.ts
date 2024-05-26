import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ _id: false })
class Address {
  @Prop({ require: true })
  addressName: string;

  @Prop({ require: true })
  addressUserName: string;

  @Prop({ require: true })
  addressPhoneNumber: string;

  @Prop({ require: true })
  address: string;
}

type AddressDocument = HydratedDocument<Address>;

const AddressSchema = SchemaFactory.createForClass(Address);

export { Address, AddressDocument, AddressSchema };
