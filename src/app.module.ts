import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EnvironmentVariables } from './config/config.dto';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigVariables } from './config/config.interface';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => {
        const validatedConfig = plainToInstance(EnvironmentVariables, config, {
          enableImplicitConversion: true,
        });
        const errors = validateSync(validatedConfig);
        if (errors.length > 0) {
          throw new Error(errors.toString());
        }
        return validatedConfig;
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService<ConfigVariables>) => ({
        uri: `mongodb+srv://${configService.get<string>('DATABASE_USER_NAME')}:${configService.get<string>('DATABASE_PASSWORD')}@${configService.get<string>('DATABASE_HOST')}/${configService.get<string>('DATABASE_NAME')}?${configService.get<string>('DATABASE_OPTIONS')}`,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
