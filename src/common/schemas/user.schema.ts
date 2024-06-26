import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Address } from 'src/common/schemas/address.schema';

const PLACEHOLDER_PROFILE_IMAGE =
  'https://res.cloudinary.com/dxgpgpoiw/image/upload/v1716466382/users-profile-images/co496dlx7div6qhqeu5g.webp';

@Schema()
class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  displayName: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: PLACEHOLDER_PROFILE_IMAGE })
  profileImage: string;

  @Prop({ type: String, nullable: true, required: true })
  verificationToken: string | null;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: [] })
  addresses: Address[];

  @Prop({
    type: [{ product: { type: Types.ObjectId, ref: 'Product' } }],
    default: [],
  })
  wishlist: { product: Types.ObjectId }[];

  // @Prop({ required: true })
  // orders: [Order];
}

type UserDocument = HydratedDocument<User>;

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('validate', function (next) {
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

export { User, UserDocument, UserSchema };
