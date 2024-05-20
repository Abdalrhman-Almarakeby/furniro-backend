import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigVariables } from 'src/config/config.interface';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService<ConfigVariables, true>,
      ) => ({
        uri: `mongodb+srv://${configService.get<string>('DATABASE_USER_NAME')}:${configService.get<string>('DATABASE_PASSWORD')}@${configService.get<string>('DATABASE_HOST')}/${configService.get<string>('DATABASE_NAME')}?${configService.get<string>('DATABASE_OPTIONS')}`,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
