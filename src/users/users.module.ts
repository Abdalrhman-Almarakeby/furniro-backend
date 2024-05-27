import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { PasswordService } from 'src/common/services/password.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { User, UserSchema } from '../common/schemas/user.schema';
import { Product, ProductSchema } from 'src/common/schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    UserService,
    PasswordService,
    JwtService,
    ConfigService,
    CloudinaryService,
  ],
})
export class UserModule {}
