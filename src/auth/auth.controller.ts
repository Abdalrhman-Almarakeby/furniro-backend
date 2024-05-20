import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { Request as RequestType } from 'express';
import { AuthService } from './auth.service';
import { UserService } from 'src/users/users.service';
import { RefreshJwtGuard } from './guards/refresh-jwt.guard';
import { UserWithoutPassword } from 'src/users/schemas/user.schema';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserWithoutPassword> {
    const user = await this.userService.create(createUserDto);

    return this.userService.removePassword(user);
  }

  @Post('login')
  async login(@Body() LoginData: LoginDto): Promise<{
    user: UserWithoutPassword;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  }> {
    return this.authService.login(LoginData);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(
    @Request()
    req: RequestType & {
      user: {
        email: string;
        sub: UserWithoutPassword;
      };
    },
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    return this.authService.refreshToken(req.user);
  }
}
