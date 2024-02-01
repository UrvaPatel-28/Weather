import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    HttpModule,
    CacheModule.register({
      ttl: 0,
      store: redisStore,
      host: 'localhost',
      port: 6379
    }),

  ],
  controllers: [WeatherController,],
  providers: [WeatherService]
})
export class WeatherModule { }
