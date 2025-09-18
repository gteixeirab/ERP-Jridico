"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupGlobalExceptionHandlers = setupGlobalExceptionHandlers;
const common_1 = require("@nestjs/common");
const logger = new common_1.Logger('GlobalExceptionHandler');
function setupGlobalExceptionHandlers() {
    process.on('unhandledRejection', (reason, promise) => {
        logger.error('Rejeição de promessa não tratada:');
        logger.error(reason);
    });
    process.on('uncaughtException', (error) => {
        logger.error('Exceção não capturada:');
        logger.error(error.stack);
        if (!(error instanceof Error)) {
            process.exit(1);
        }
    });
    const signals = ['SIGINT', 'SIGTERM', 'SIGHUP'];
    signals.forEach(signal => {
        process.on(signal, () => {
            logger.log(`Recebido sinal ${signal}. Encerrando aplicação...`);
            process.exit(0);
        });
    });
}
//# sourceMappingURL=global-exception.handler.js.map