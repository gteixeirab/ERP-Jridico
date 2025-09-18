"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
const global_exception_handler_1 = require("./common/exceptions/global-exception.handler");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const port = process.env.PORT || 3000;
    app.enableCors({
        origin: "http://localhost:5000",
        credentials: true,
    });
    (0, global_exception_handler_1.setupGlobalExceptionHandlers)();
    app.setGlobalPrefix("api");
    const httpAdapterHost = app.get(core_1.HttpAdapterHost);
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter(httpAdapterHost), new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: false,
        disableErrorMessages: process.env.NODE_ENV === 'production',
        transformOptions: {
            enableImplicitConversion: true,
        },
        validationError: {
            target: false,
            value: false,
        },
    }));
    await app.listen(port);
    const logger = new common_1.Logger("Bootstrap");
    logger.log(`Aplicação rodando na porta ${port}`);
}
bootstrap().catch((error) => {
    console.error("Erro crítico durante a inicialização:", error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map