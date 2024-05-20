import { IsString, IsNotEmpty, IsInt, IsBoolean } from 'class-validator';
import { ConfigVariables } from './config.interface';

export class EnvironmentVariables implements ConfigVariables {
  // Database
  @IsString()
  @IsNotEmpty()
  DATABASE_USER_NAME: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_HOST: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_NAME: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_OPTIONS: string;

  // JWT secret keys
  @IsString()
  @IsNotEmpty()
  JWT_SECRET_KEY: string;

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_TOKEN_SECRET_KEY: string;

  // Email Service
  @IsString()
  @IsNotEmpty()
  EMAIL_HOST: string;

  @IsInt()
  EMAIL_PORT: number;

  @IsBoolean()
  EMAIL_SECURE: boolean;

  @IsString()
  @IsNotEmpty()
  EMAIL_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  EMAIL_PASSWORD: string;
}
