import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('Verificando se o usuário admin já existe...');
    
    // Verifica se o usuário admin já existe
    const adminEmail = 'admin@admin.com';
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log('Usuário admin já existe. Nenhuma ação necessária.');
      return;
    }

    // Criptografa a senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Cria o usuário admin
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Administrador',
        password: hashedPassword,
        isActive: true,
      },
    });

    console.log('Usuário admin criado com sucesso!');
    console.log('Email: admin@admin.com');
    console.log('Senha: admin123');
    console.log('ATENÇÃO: Esta é uma configuração de desenvolvimento. NUNCA use em produção!');
  } catch (error) {
    console.error('Erro ao criar usuário admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
