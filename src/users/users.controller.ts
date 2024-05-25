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
import { UserWithoutPassword } from '../common/schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Post(':id/profile-image')
  @UseInterceptors(FileInterceptor('profile-image'))
  async uploadProfileImage(
    @Param('id', ObjectIdValidationPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UserWithoutPassword> {
    const user = await this.userService.uploadProfileImage(id, file);

    return this.userService.removePassword(user);
  }

  @Get()
  async findAll(): Promise<UserWithoutPassword[]> {
    const users = await this.userService.findAll();

    return users.map(this.userService.removePassword);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<UserWithoutPassword> {
    const user = await this.userService.findOne(id);

    return this.userService.removePassword(user);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserWithoutPassword> {
    const user = await this.userService.update(id, updateUserDto);

    return this.userService.removePassword(user);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<UserWithoutPassword> {
    const user = await this.userService.remove(id);

    return this.userService.removePassword(user);
  }
}
