import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { ConfigVariables } from 'src/config/config.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import {
  User,
  UserDocument,
  UserWithoutPassword,
} from '../common/schemas/user.schema';
import { PasswordService } from 'src/common/services/password.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly passwordService: PasswordService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService<ConfigVariables, true>,
    private cloudinaryService: CloudinaryService,
  ) {}

  removePassword(user: User): UserWithoutPassword {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return rest;
  }

  private async sendVerificationEmail(email: string, token: string) {
    const domainName = this.configService.get<string>('DOMAIN_NAME_URL');
    const verificationLink = `${domainName}/auth/verify-email?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Email Verification',
      template: 'verification',
      context: {
        email,
        verificationLink,
      },
    });
  }

  async uploadProfileImage(
    userId: string,
    file: Express.Multer.File,
  ): Promise<User> {
    const folder = 'users-profile-images';
    const fileUrl = await this.cloudinaryService.uploadFile(file, folder);

    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.profileImage = fileUrl;

    return user.save();
  }

  async addToWishlist(userId: string, itemId: string): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $addToSet: { wishlist: itemId } },
        { new: true },
      )
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async removeFromWishlist(userId: string, itemId: string): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(userId, { $pull: { wishlist: itemId } }, { new: true })
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
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

  async verifyEmail(verificationToken: string): Promise<User> {
    const user = await this.userModel.findOne({ verificationToken });

    if (!user) {
      throw new BadRequestException('Invalid token');
    }

    await this.userModel.findOneAndUpdate(
      { verificationToken },
      {
        isVerified: true,
        verificationToken: null,
      },
    );

    return user;
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
    const verificationToken = uuidv4();

    const newUserData = {
      ...createUserDto,
      verificationToken,
      password: hashedPassword,
    };
    const createdUser = await new this.userModel(newUserData).save();

    await this.sendVerificationEmail(createdUser.email, verificationToken);

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
