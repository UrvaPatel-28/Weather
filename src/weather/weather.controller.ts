import { Body, Controller, Get, Ip, Post, Query, Req } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { GeoCodesDto, CityNamesDto } from './dto/weather.dto';
import { Request, query } from 'express';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller('weather')

export class WeatherController {
    constructor(private readonly weatherService: WeatherService) { }

    @Get('by-names')
    // @CacheKey('custom_key')
    // @CacheTTL(20)
    getInfoByNames(@Query() cityCountryName: CityNamesDto, @Req() req: Request) {
        console.log("cityname", req);

        return this.weatherService.getInfoByNames(cityCountryName, req)
    }

    // @Get('codes')
    // getCodesByIp(@Req() req: Request) {
    //     return this.weatherService.getCodesByIp()
    // }




    @Get('cache')
    getCacheData() {
        return this.weatherService.getCacheData();
    }

    // @Get('info')
    // getInfoByCodes(@Req() req: Request) {
    //     return this.weatherService.getInfoByCodes()
    // }

    ///////////////////////////////////////////////////////////////////////////////


    @Get('forecast')
    forecastData(@Query() query: GeoCodesDto) {
        return this.weatherService.forecastData(query);
    }

}
