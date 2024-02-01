import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { GeoCodesDto, CityNamesDto } from './dto/weather.dto';
import { catchError, map, tap } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Request } from 'express';

@Injectable()
export class WeatherService {
    private logger = new Logger(WeatherService.name)
    constructor(private readonly httpService: HttpService, @Inject(CACHE_MANAGER) private cacheManager: Cache) { }

    async getInfoByNames(cityCountryName, req: Request) {
        const { city, country } = cityCountryName
        const names = `${city},${country}`

        // store data in cache memory
        const cityData = await this.cacheManager.get(`'names':${names.toLowerCase()}`) //city and country bnne jode nai aavtu
        if (cityData) {
            console.log("from cache");
            return cityData
        }

        const apiUrl = `https://api.openweathermap.org/data/2.5/find?q=${names}&type=like&sort=population&cnt=10&appid=${process.env.OPENWEATHER_SECRET_KEY}`
        const response = await this.httpService.axiosRef.get(apiUrl)

        if (response.data.list.length < 1) {
            throw new NotFoundException("city not found")
        }
        await this.cacheManager.set(`'names':${names.toLowerCase()}`, response.data)

        //log
        this.logger.log(`Weather data of city ${city}`)

        return response.data
    }




    async getCacheData() {
        const value: any = await this.cacheManager.get(`surat,`);
        console.log(value);

        return value.list[0]
    }





    //////////////////////////////



    async forecastData(query: GeoCodesDto) {
        const { latitude, longitude, date } = query;
        const coordinates = `${latitude},${longitude}`

        // store data in cache memory
        const coordinatesData = await this.cacheManager.get(`'coordinates':${coordinates},${date}`) //city and country bnne jode nai aavtu
        if (coordinatesData) {
            console.log("from cache");
            return coordinatesData
        }

        console.log(query);

        console.log();

        const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=8478776093ef4cce8b192825243101&q=${coordinates}&dt=${date}`
        console.log(apiUrl);

        const response = await this.httpService.axiosRef.get(apiUrl)

        // if (response.data.list.length < 1) {
        //     throw new NotFoundException("city not found")
        // }
        // await this.cacheManager.set(`'names':${names.toLowerCase()}`, response.data)
        await this.cacheManager.set(`'coordinates':${coordinates},${date}`, response.data)

        //log
        this.logger.log(`Weather data of Latitude:${latitude} Longitude:${longitude}`)

        return response.data
    }
}



//for retrive ip address
// const forwardedIps = req.headers['x-forwarded-for'];
// const ipAddress = forwardedIps ? forwardedIps.split(',')[0] : req.ip;
// console.log(ipAddress);

//for retrive ip address
// const forwardedIps = req.headers['x-forwarded-for'];
// const ipAddress = forwardedIps ? forwardedIps.split(',')[0] : req.ip;
// console.log(ipAddress);

//     const apiUrl = `https://api.radar.io/v1/geocode/ip`

//     return this.httpService.get(apiUrl, {
//         headers: {
//             'Authorization': 'prj_live_sk_9d3e012357087cece4b2884af3e48633e257f148'
//         }
//     }).pipe(
//         map((response) => {
//             const { latitude, longitude } = response.data.address
//             return this.getInfoByCodes(latitude, longitude)
//         })
//     );
// }









