declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: number;
    DB_CONNECT_URL: string;
    JWT_SECRET_KEY: string;
    JWT_REFRESH_TOKEN_SECRET_KEY: string;
  }
}
