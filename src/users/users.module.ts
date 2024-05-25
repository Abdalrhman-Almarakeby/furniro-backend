import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { User, UserSchema } from '../common/schemas/user.schema';
import { PasswordService } from 'src/common/services/password.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
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
