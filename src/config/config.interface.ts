export interface ConfigVariables {
  // Database
  DATABASE_USER_NAME: string;
  DATABASE_PASSWORD: string;
  DATABASE_HOST: string;
  DATABASE_NAME: string;
  DATABASE_OPTIONS: string;

  // JWT secret keys
  JWT_SECRET_KEY: string;
  JWT_REFRESH_TOKEN_SECRET_KEY: string;
}
