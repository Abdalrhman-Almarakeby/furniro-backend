import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConfigVariables } from 'src/config/config.interface';
import { UserService } from 'src/users/users.service';
import { PasswordService } from 'src/common/services/password.service';
import { LoginDto } from './dto/login.dto';
import { UserWithoutPassword } from 'src/users/schemas/user.schema';

type Payload = {
  email: string;
  sub: UserWithoutPassword;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<ConfigVariables, true>,
  ) {}

  private accessTokenOptions: JwtSignOptions = {
    expiresIn: '1h',
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

  private async validatedUser(
    loginData: LoginDto,
  ): Promise<UserWithoutPassword> {
    const user = await this.userService.findOneByEmail(loginData.email);
    const isCorrectPassword = await this.passwordService.verifyPassword(
      loginData.password,
      user.password,
    );

    if (!user || !isCorrectPassword) {
      throw new UnauthorizedException('The email or password is incorrect');
    }

    return this.userService.removePassword(user);
  }

  async login(loginData: LoginDto): Promise<{
    user: UserWithoutPassword;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  }> {
    const user = await this.validatedUser(loginData);

    const payload = {
      email: user.email,
      sub: user,
    };

    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload);

    return {
      user,
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  async refreshToken(requestPayload: Payload): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const payload = {
      email: requestPayload.email,
      sub: requestPayload.sub,
    };

    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
    };
  }
}
