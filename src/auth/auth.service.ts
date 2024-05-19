import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/users.service';
import { PasswordService } from 'src/password/password.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  private async validatedUser(loginData: LoginDto) {
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

  async login(loginData: LoginDto) {
    const user = await this.validatedUser(loginData);

    const payload = {
      email: user.email,
      sub: user,
    };

    const accessTokenOptions = {
      expiresIn: '1h',
      secret: process.env.JWT_SECRET_KEY,
    };
    const refreshTokenOptions = {
      expiresIn: '30d',
      secret: process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
    };

    const accessToken = await this.jwtService.signAsync(
      payload,
      accessTokenOptions,
    );
    const refreshToken = await this.jwtService.signAsync(
      payload,
      refreshTokenOptions,
    );

    return {
      user,
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }
}
