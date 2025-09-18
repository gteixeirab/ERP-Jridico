DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'erp_juridico') THEN
        CREATE DATABASE erp_juridico;
        RAISE NOTICE 'Banco de dados erp_juridico criado com sucesso!';
    ELSE
        RAISE NOTICE 'O banco de dados erp_juridico já existe.';
    END IF;
END
$$;
