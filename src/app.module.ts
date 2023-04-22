import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidation } from './utils/zodvalidation.utils';
import { AdminsModule } from './admins/admins.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MongooseModule.forRoot(process.env.DB_URI),
    ProductsModule,
    AdminsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidation,
    },
  ],
})
export class AppModule {}
