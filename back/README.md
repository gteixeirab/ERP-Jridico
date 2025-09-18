# ERP Jurídico - Backend

Backend simplificado para o sistema ERP Jurídico, construído com NestJS e Prisma.

## Requisitos

- Node.js (v18+)
- PostgreSQL (v14+)
- npm ou yarn

## Configuração

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente no arquivo `.env`:
   ```
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/erp_juridico"
   ```

## Executando o Projeto

1. Gere o cliente do Prisma:
   ```bash
   npx prisma generate
   ```

2. Execute as migrações do banco de dados:
   ```bash
   npx prisma migrate dev --name init
   ```

3. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run start:dev
   ```

O servidor estará disponível em `http://localhost:3000`

## Estrutura do Projeto

- `src/` - Código-fonte da aplicação
  - `app.controller.ts` - Controlador principal
  - `app.module.ts` - Módulo principal
  - `prisma/` - Configuração e modelos do Prisma

## Comandos Úteis

- `npm run build` - Compila o projeto
- `npm run start` - Inicia o servidor em produção
- `npm run start:dev` - Inicia o servidor em modo de desenvolvimento
- `npx prisma studio` - Abre o Prisma Studio para visualizar os dados

## Licença

ISC
