import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConfigVariables } from 'src/config/config.interface';
import { UserService } from 'src/users/users.service';
import { PasswordService } from 'src/common/services/password.service';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/common/schemas/user.schema';

type Payload = {
  email: string;
  sub: User;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<ConfigVariables, true>,
  ) {}

  private accessTokenExpireTimeSecond = 60 * 60 * 24;

  private accessTokenOptions: JwtSignOptions = {
    expiresIn: this.accessTokenExpireTimeSecond,
    secret: this.configService.get<string>('JWT_SECRET_KEY'),
  };

  private refreshTokenOptions: JwtSignOptions = {
    expiresIn: '30d',
    secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET_KEY'),
  };

  private async generateAccessToken(payload: Payload): Promise<string> {
    return this.jwtService.signAsync(payload, this.accessTokenOptions);
  }

  private async generateRefreshToken(payload: Payload): Promise<string> {
    return this.jwtService.signAsync(payload, this.refreshTokenOptions);
  }

  private getExpiresInTime(expireTimeSecond: number) {
    return new Date().setTime(new Date().getTime() + expireTimeSecond * 1000);
  }

  private async validatedUser(loginData: LoginDto): Promise<User> {
    const user = await this.userService.findOneByEmail(loginData.email);

    if (!user.isVerified) {
      throw new UnauthorizedException('Email is not verified');
    }

    const isCorrectPassword = await this.passwordService.verifyPassword(
      loginData.password,
      user.password,
    );

    if (!user || !isCorrectPassword) {
      throw new UnauthorizedException('The email or password is incorrect');
    }

    return user;
  }

  async login(loginData: LoginDto): Promise<{
    user: User;
    tokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  }> {
    const user = await this.validatedUser(loginData);

    const payload = {
      email: user.email,
      sub: user,
    };

    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload);
    const expiresIn = this.getExpiresInTime(this.accessTokenExpireTimeSecond);

    return {
      user,
      tokens: {
        accessToken,
        refreshToken,
        expiresIn,
      },
    };
  }

  async refreshToken(requestPayload: Payload): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {
    const payload = {
      email: requestPayload.email,
      sub: requestPayload.sub,
    };

    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload);
    const expiresIn = this.getExpiresInTime(this.accessTokenExpireTimeSecond);

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }
}
