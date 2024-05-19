import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';
import { PasswordService } from 'src/password/password.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UserService, PasswordService, JwtService],
})
export class UserModule {}
