-- Verificar tabelas existentes
SELECT name FROM sqlite_master WHERE type='table';

-- Verificar estrutura da tabela User
PRAGMA table_info(User);

-- Verificar estrutura da tabela Client
PRAGMA table_info(Client);

-- Verificar se existem usuários
SELECT * FROM User;
