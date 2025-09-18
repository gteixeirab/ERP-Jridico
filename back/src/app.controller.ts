import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getStatus() {
    return {
      message: 'API do ERP Jurídico',
      status: 'online',
      timestamp: new Date().toISOString()
    };
  }
}
