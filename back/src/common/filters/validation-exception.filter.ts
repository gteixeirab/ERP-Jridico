import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch(Error)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.BAD_REQUEST;

    console.error('Erro de validação:', exception);

    // Verifica se é um erro de validação do class-validator
    if (Array.isArray((exception as any).response?.message)) {
      return response.status(status).json({
        success: false,
        message: 'Erro de validação',
        errors: (exception as any).response.message,
        error: 'Bad Request',
        statusCode: status,
      });
    }

    // Outros erros de validação
    return response.status(status).json({
      success: false,
      message: exception.message || 'Erro de validação',
      error: 'Bad Request',
      statusCode: status,
    });
  }
}
