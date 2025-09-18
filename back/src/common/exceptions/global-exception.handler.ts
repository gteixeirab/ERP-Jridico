import { Logger } from '@nestjs/common';

const logger = new Logger('GlobalExceptionHandler');

export function setupGlobalExceptionHandlers() {
  // Captura rejeições de promessas não tratadas
  process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
    logger.error('Rejeição de promessa não tratada:');
    logger.error(reason);
    // Aqui você pode adicionar lógica para notificar um serviço de monitoramento
  });

  // Captura exceções não capturadas
  process.on('uncaughtException', (error: Error) => {
    logger.error('Exceção não capturada:');
    logger.error(error.stack);
    // Aqui você pode adicionar lógica para notificar um serviço de monitoramento
    
    // Encerra o processo apenas se necessário
    if (!(error instanceof Error)) {
      process.exit(1);
    }
  });

  // Captura sinais de encerramento para um desligamento limpo
  const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGHUP'];
  
  signals.forEach(signal => {
    process.on(signal, () => {
      logger.log(`Recebido sinal ${signal}. Encerrando aplicação...`);
      // Aqui você pode adicionar lógica de limpeza antes de encerrar
      process.exit(0);
    });
  });
}
