const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/dev.db');

// Criação da tabela User
db.serialize(() => {
  // Remove a tabela se ela já existir
  db.run('DROP TABLE IF EXISTS User');
  
  // Cria a tabela User
  db.run(`
    CREATE TABLE IF NOT EXISTS User (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      refreshToken TEXT,
      isActive BOOLEAN DEFAULT 1,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);

  console.log('Tabela User criada com sucesso!');
});

db.close((err) => {
  if (err) {
    console.error('Erro ao fechar o banco de dados:', err);
  } else {
    console.log('Banco de dados configurado com sucesso!');
  }
});
