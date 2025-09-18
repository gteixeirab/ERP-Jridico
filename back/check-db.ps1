# Verifica se o banco de dados existe
$dbExists = psql -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname='erp_juridico'"

if (-not $dbExists) {
    Write-Host "Criando banco de dados erp_juridico..."
    psql -U postgres -c "CREATE DATABASE erp_juridico;"
    Write-Host "Banco de dados criado com sucesso!"
} else {
    Write-Host "O banco de dados já existe."
}

# Executa as migrações do Prisma
Write-Host "Executando migrações do Prisma..."
npx prisma migrate dev --name init
