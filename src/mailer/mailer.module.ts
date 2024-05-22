import { Module } from '@nestjs/common';
import {
  MailerOptions,
  MailerModule as NestMailerModule,
} from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { ConfigVariables } from 'src/config/config.interface';
import { join } from 'path';
@Module({
  imports: [
    NestMailerModule.forRootAsync({
      useFactory: async (
        configService: ConfigService<ConfigVariables, true>,
      ): Promise<MailerOptions> => {
        const options: MailerOptions = {
          transport: {
            host: configService.get<string>('EMAIL_HOST'),
            port: configService.get<number>('EMAIL_PORT'),
            secure: configService.get<boolean>('EMAIL_SECURE'),
            auth: {
              user: configService.get<string>('EMAIL_USERNAME'),
              pass: configService.get<string>('EMAIL_PASSWORD'),
            },
          },
          template: {
            dir: join(__dirname, '../email-templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };

        return options;
      },
      inject: [ConfigService],
    }),
  ],
  exports: [NestMailerModule],
})
export class MailerModule {}
