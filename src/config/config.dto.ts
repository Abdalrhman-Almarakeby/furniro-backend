import { IsString, IsNotEmpty } from 'class-validator';
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
}
