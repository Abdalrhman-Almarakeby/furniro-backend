import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserWithoutPassword } from './schemas/user.schema';
import { PasswordService } from 'src/password/password.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly passwordService: PasswordService,
  ) {}

  removePassword(user: User): UserWithoutPassword {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return rest;
  }

  async findAll(): Promise<User[]> {
    const usersDocuments = await this.userModel.find().exec();

    return usersDocuments.map((user) => user.toObject());
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.toObject();
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.toObject();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await this.passwordService.hashPassword(
      createUserDto.password,
    );
    const newUserData = {
      ...createUserDto,
      password: hashedPassword,
    };
    const createdUser = await new this.userModel(newUserData).save();

    return createdUser.toObject();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.toObject();
  }

  async remove(id: string): Promise<User> {
    const user = await this.userModel.findByIdAndDelete(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.toObject();
  }
}
