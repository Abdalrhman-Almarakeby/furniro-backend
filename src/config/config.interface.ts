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

  // Email Service
  EMAIL_HOST: string;
  EMAIL_PORT: number;
  EMAIL_SECURE: boolean;
  EMAIL_USERNAME: string;
  EMAIL_PASSWORD: string;

  // Pages and links
  DOMAIN_NAME_URL: string;
  VERIFY_EMAIL_REDIRECT_LINK: string;

  // cloudinary
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: number;
  CLOUDINARY_API_SECRET: string;
}
