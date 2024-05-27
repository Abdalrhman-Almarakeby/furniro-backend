import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ObjectIdValidationPipe } from 'src/common/pipes/object-id-validation.pipe';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UserService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'src/common/schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<User> {
    return await this.userService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id', ObjectIdValidationPipe) id: string): Promise<User> {
    return await this.userService.remove(id);
  }

  @UseGuards(AuthGuard)
  @Post(':id/profile-image')
  @UseInterceptors(FileInterceptor('profile-image'))
  async uploadProfileImage(
    @Param('id', ObjectIdValidationPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<User> {
    const user = await this.userService.uploadProfileImage(id, file);

    return user;
  }
}
