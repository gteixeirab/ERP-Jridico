SELECT 'Database erp_juridico already exists' AS message
WHERE EXISTS (SELECT 1 FROM pg_database WHERE datname = 'erp_juridico')

\gset

\if :ERROR
  \! echo "Erro ao verificar a existência do banco de dados"
  \q
\endif

\if :ROW_COUNT = 0
  CREATE DATABASE erp_juridico;
  \! echo "Banco de dados erp_juridico criado com sucesso!"
\else
  \! echo "O banco de dados erp_juridico já existe."
\endif
