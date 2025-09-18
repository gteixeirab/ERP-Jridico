import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
export declare class ValidationExceptionFilter implements ExceptionFilter {
    catch(exception: Error, host: ArgumentsHost): Response<any, Record<string, any>>;
}
