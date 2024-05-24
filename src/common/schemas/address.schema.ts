import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ _id: false })
class Address {
  @Prop()
  addressName: string;

  @Prop()
  addressUserName: string;

  @Prop()
  addressPhoneNumber: string;

  @Prop()
  address: string;
}

type AddressDocument = HydratedDocument<Address>;

const AddressSchema = SchemaFactory.createForClass(Address);

export { Address, AddressDocument, AddressSchema };
