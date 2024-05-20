import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { RefreshJwtGuard } from './guards/refresh-jwt.guard';
import { Request as RequestType } from 'express';
import { UserWithoutPassword } from 'src/users/schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);

    return this.userService.removePassword(user);
  }

  @Post('login')
  login(@Body() LoginData: LoginDto) {
    return this.authService.login(LoginData);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  refreshToken(
    @Request()
    req: RequestType & {
      user: {
        email: string;
        sub: UserWithoutPassword;
      };
    },
  ) {
    return this.authService.refreshToken(req.user);
  }
}
