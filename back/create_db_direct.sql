SELECT 'Verificando se o banco de dados existe...' AS mensagem;
\o /dev/null
SELECT 1 FROM pg_database WHERE datname = 'erp_juridico'\gset db_exists_
\o

\if :db_exists
  \echo 'O banco de dados erp_juridico já existe.'
\else
  \echo 'Criando o banco de dados erp_juridico...'
  CREATE DATABASE erp_juridico;
  \echo 'Banco de dados erp_juridico criado com sucesso!'
\endif
