import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request as RequestType, Response } from 'express';
import { AuthService } from './auth.service';
import { UserService } from 'src/users/users.service';
import { RefreshJwtGuard } from './guards/refresh-jwt.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { ConfigVariables } from 'src/config/config.interface';
import { User } from 'src/common/schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService<ConfigVariables, true>,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  async login(@Body() LoginData: LoginDto): Promise<{
    user: User;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  }> {
    return this.authService.login(LoginData);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string, @Res() res: Response) {
    if (!token) {
      throw new BadRequestException('Token is required');
    }

    await this.userService.verifyEmail(token);

    const loginPageLink = this.configService.get<string>(
      'VERIFY_EMAIL_REDIRECT_LINK',
    );

    return res.redirect(loginPageLink);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(
    @Request()
    req: RequestType & {
      user: {
        email: string;
        sub: User;
      };
    },
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    return this.authService.refreshToken(req.user);
  }
}
