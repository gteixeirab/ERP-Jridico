import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const API_URL = 'http://localhost:3000';

async function testAuth() {
  try {
    console.log('🚀 Iniciando testes de autenticação...\n');

    // 1. Verificar/Criar usuário de teste
    console.log('🔍 Verificando usuário de teste...');
    const testEmail = 'test@example.com';
    const testPassword = 'senha123';
    
    let user = await prisma.user.findUnique({
      where: { email: testEmail },
    });

    if (!user) {
      console.log('👤 Criando usuário de teste...');
      const hashedPassword = await bcrypt.hash(testPassword, 10);
      user = await prisma.user.create({
        data: {
          email: testEmail,
          name: 'Usuário de Teste',
          password: hashedPassword,
          isActive: true,
        },
      });
      console.log(`✅ Usuário criado: ${user.email}`);
    } else {
      console.log(`✅ Usuário encontrado: ${user.email}`);
    }

    // 2. Testar login
    console.log('\n🔑 Testando login...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: testEmail,
      password: testPassword,
    });

    console.log('✅ Login bem-sucedido!');
    const { accessToken, refreshToken } = loginResponse.data;
    console.log(`🔑 Access Token: ${accessToken.substring(0, 20)}...`);
    console.log(`🔄 Refresh Token: ${refreshToken.substring(0, 20)}...`);

    // 3. Testar rota protegida
    console.log('\n🔒 Testando rota protegida...');
    const protectedResponse = await axios.get(`${API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log('✅ Acesso à rota protegida bem-sucedido!');
    console.log('📋 Dados do usuário:', protectedResponse.data);

    // 4. Testar refresh token
    console.log('\n🔄 Testando refresh token...');
    const refreshResponse = await axios.post(`${API_URL}/auth/refresh`, {
      refreshToken,
    });

    console.log('✅ Token atualizado com sucesso!');
    const newAccessToken = refreshResponse.data.accessToken;
    console.log(`🔑 Novo Access Token: ${newAccessToken.substring(0, 20)}...`);

    // 5. Testar logout
    console.log('\n🚪 Testando logout...');
    await axios.post(
      `${API_URL}/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${newAccessToken}`,
        },
      }
    );

    console.log('✅ Logout realizado com sucesso!');
  } catch (error) {
    if (error.response) {
      console.error('❌ Erro na resposta:', {
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      console.error('❌ Nenhuma resposta recebida:', error.request);
    } else {
      console.error('❌ Erro ao configurar a requisição:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

testAuth();
