import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherModule } from './weather/weather.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CustomHttpExceptionFilter } from './weather/Exceptions/http.exception.filter';
import { ConfigModule } from '@nestjs/config';
import { LoggingInteceptor } from './Interceptors/logging.interceptor';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from './db/entities/log.entity';
import { LogsModule } from './logs/logs.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    WeatherModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      entities: [],
      logging: true
    }),
    LogsModule

  ],//
  controllers: [AppController],
  providers: [AppService, { provide: APP_FILTER, useClass: CustomHttpExceptionFilter }, { provide: APP_INTERCEPTOR, useClass: LoggingInteceptor },
    // { provide: APP_INTERCEPTOR, useClass: CacheInterceptor },
  ],
})
export class AppModule { }
