import { NestFactory, HttpAdapterHost } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger, ValidationPipe } from "@nestjs/common";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
import { setupGlobalExceptionHandlers } from "./common/exceptions/global-exception.handler";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  // Configuração básica
  app.enableCors({
    origin: "http://localhost:5000",
    credentials: true,
  });

  // Configurar o manipulador global de exceções
  setupGlobalExceptionHandlers();

  // Adicionar prefixo global para todas as rotas da API
  app.setGlobalPrefix("api");

  // Filtro global de exceções
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new AllExceptionsFilter(httpAdapterHost),
    new HttpExceptionFilter()
  );

  // Validação global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false, // Permite propriedades extras no payload
      disableErrorMessages: process.env.NODE_ENV === 'production',
      transformOptions: {
        enableImplicitConversion: true,
      },
      validationError: {
        target: false, // Não inclui o objeto alvo no erro de validação
        value: false, // Não inclui o valor no erro de validação
      },
    })
  );

  // Iniciar servidor
  await app.listen(port);

  const logger = new Logger("Bootstrap");
  logger.log(`Aplicação rodando na porta ${port}`);
}

bootstrap().catch((error) => {
  console.error("Erro crítico durante a inicialização:", error);
  process.exit(1);
});
