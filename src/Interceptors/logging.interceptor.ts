import { CallHandler, ExecutionContext, Logger, NestInterceptor } from "@nestjs/common";
import { Request, Response } from "express";
import { Observable, map, tap } from "rxjs";

import * as fs from 'fs';
import * as path from 'path';


export class LoggingInteceptor implements NestInterceptor {
    // private readonly filePath: string = path.join(__dirname, '../../src/logs/success.json');
    private logger = new Logger(LoggingInteceptor.name)

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {


        const ctx = context.switchToHttp();
        const request: Request = ctx.getRequest<Request>();
        const response: Response = ctx.getResponse<Response>();

        console.log("Requested", request.url)

        const startTime = Date.now();
        console.log(response.statusCode);


        // return next.handle().pipe(tap(() => {
        //     const endTime = Date.now();
        //     const resTime = endTime - startTime;

        //     const data = {
        //         isError: false,
        //         data: request.body,
        //         method: request.method,
        //         path: request.path,
        //         code: response.statusCode,
        //         Time: `${resTime}ms`,
        //         date: new Date().toISOString()
        //     }
        //     this.writeSuccessLog(data);

        // }))

        return next.handle().pipe(

            map(data => {
                const endTime = Date.now();
                const resTime = endTime - startTime;

                const result = {
                    data: data,
                    isError: false,
                    statusCode: response.statusCode,
                    time: `${resTime}ms`,
                    date: new Date().toISOString()
                };
                // console.log(result.message);


                this.logger.log(`Request Successful '${result.statusCode}' {${request.url},${request.method}} ${result.time}`)
                return result
            }),
        );
    }


    // //for logging exceptions
    // private writeSuccessLog(data): any {
    //     const filePath = path.join(__dirname, '../../src/logs/success.json');


    //     try {
    //         fs.appendFileSync(filePath, `${JSON.stringify(data)}` + '\n');
    //     } catch (err) {
    //         return err
    //     }
    // }

}