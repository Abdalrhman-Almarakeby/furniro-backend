import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ObjectIdValidationPipe } from 'src/pipes/object-id-validation.pipe';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    const users = await this.userService.findAll();

    return users.map(this.userService.removePassword);
  }

  @Get(':id')
  async findOne(@Param('id', ObjectIdValidationPipe) id: string) {
    const user = await this.userService.findOne(id);

    return this.userService.removePassword(user);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);

    return this.userService.removePassword(user);
  }

  @Patch(':id')
  async update(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.userService.update(id, updateUserDto);

    return this.userService.removePassword(user);
  }

  @Delete(':id')
  async remove(@Param('id', ObjectIdValidationPipe) id: string) {
    const user = await this.userService.remove(id);

    return this.userService.removePassword(user);
  }
}
