import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    
    let message = 'Erro interno do servidor';
    let error = 'Internal Server Error';

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const responseObj = exceptionResponse as Record<string, any>;
      message = responseObj.message || exception.message;
      error = responseObj.error || exception.name;
    } else if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
      error = exception.name;
    }

    // Log do erro
    console.error(`[${new Date().toISOString()}] ${request.method} ${request.url} - ${status} - ${message}`, exception.stack);

    // Resposta padronizada
    response.status(status).json({
      statusCode: status,
      message: message,
      error: error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
