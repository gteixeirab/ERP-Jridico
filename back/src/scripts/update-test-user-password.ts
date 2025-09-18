import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

async function updateTestUserPassword() {
  const prisma = new PrismaClient();
  
  try {
    const password = 'senha123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const updatedUser = await prisma.user.update({
      where: { email: 'test@example.com' },
      data: { 
        password: hashedPassword 
      },
      select: {
        id: true,
        email: true,
        name: true
      }
    });

    console.log('Senha do usuário de teste atualizada com sucesso:', updatedUser);
  } catch (error) {
    console.error('Erro ao atualizar senha do usuário de teste:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateTestUserPassword();
