import { MiddlewareConsumer, Module } from '@nestjs/common';
import { HelmetMiddleware } from './common/middlewares/helmet.middleware';
import { RateLimitMiddleware } from './common/middlewares/rate-limit.middleware';
import { HttpsRedirectMiddleware } from './common/middlewares/https-redirect.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { MailerModule } from './mailer/mailer.module';
import { ProductModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule,
    MailerModule,
    DatabaseModule,
    UserModule,
    AuthModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HelmetMiddleware, HttpsRedirectMiddleware, RateLimitMiddleware)
      .forRoutes('*');
  }
}
