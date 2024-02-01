import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from "@nestjs/common"
import { Response, Request } from "express";
import * as fs from "fs";

import * as path from 'path'


@Catch(HttpException)
export class CustomHttpExceptionFilter implements ExceptionFilter {
    private logger = new Logger(CustomHttpExceptionFilter.name)
    catch(exception: HttpException, host: ArgumentsHost): Record<string, any> {
        const ctx = host.switchToHttp();
        const response: Response = ctx.getResponse<Response>();
        const request: Request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const errorData: any = exception.getResponse();
        const exceptionType = exception.name;

        const firstError = this.getFirstValidationError(errorData.message);
        const formattedErrors = this.formatValidationErrors(firstError);

        const baseData = {
            isError: true,
            exeptionType: exceptionType,
            timestamp: new Date().toISOString()
        }

        const data = {
            ...errorData, //whole msg object
            ...baseData, //whole basedata object
            message: formattedErrors, //overwite message 
        }

        // console.log("errorData", errorData);
        // console.log("baseData", baseData);
        // console.log("data", data);


        //log
        this.logger.error(`${exceptionType} '${data.message}' '${errorData.statusCode}'  {${request.url},${request.method}}`)
        return response.status(status).json(data)
    }

    //for getting first message
    private getFirstValidationError(errors: any): any | null {
        // Assuming `errors` is an array of validation errors
        return Array.isArray(errors) && errors.length > 0 ? errors[0] : errors;
    }

    //for converting error message in same format
    private formatValidationErrors(errors: any): string {
        return Array.isArray(errors) ? errors.join(', ') : errors;
    }



    //for logging exceptions
    private writeHttpLog(data) {
        const filePath = path.join(__dirname, '../../src/logs/exceptions.json');
        try {
            fs.appendFileSync(filePath, `${JSON.stringify(data)}` + '\n');
        } catch (err) {
            return err
        }
    }

}//