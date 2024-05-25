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
import { UserWithoutPassword } from 'src/common/schemas/user.schema';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { ConfigVariables } from 'src/config/config.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService<ConfigVariables, true>,
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
