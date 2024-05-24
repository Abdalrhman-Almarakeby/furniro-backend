import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Address } from 'src/shared/schemas/address.schema';

const PLACEHOLDER_PROFILE_IMAGE =
  'https://res.cloudinary.com/dxgpgpoiw/image/upload/v1716466382/users-profile-images/co496dlx7div6qhqeu5g.webp';

@Schema()
class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  displayName: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ default: PLACEHOLDER_PROFILE_IMAGE })
  profileImage: string;

  @Prop({ type: String, nullable: true })
  verificationToken: string | null;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: [] })
  addresses: Address[];

  // @Prop()
  // wishList: [Products];

  // @Prop()
  // orders: [Order];
}

type UserDocument = HydratedDocument<User>;

type UserWithoutPassword = Omit<User, 'password'>;

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<User>('save', function (next) {
  if (this.displayName) return next();

  const MAX_DISPLAY_NAME_LENGTH = 20;
  const fullName = `${this.firstName.trim()} ${this.lastName.trim()}`;

  if (fullName.length > MAX_DISPLAY_NAME_LENGTH) {
    this.displayName = this.lastName.trim();

    next();
  }

  this.displayName = fullName;

  next();
});

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
