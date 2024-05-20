import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
class User {
  @Prop()
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  age: number;
}

type UserDocument = HydratedDocument<User>;

type UserWithoutPassword = Omit<User, 'password'>;

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

UserSchema.set('toJSON', {
  virtuals: true,
});

UserSchema.set('toObject', {
  virtuals: true,
});

export { User, UserDocument, UserWithoutPassword, UserSchema };
