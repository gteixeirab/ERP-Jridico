"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function createAdminUser() {
    try {
        console.log('Verificando se o usuário admin já existe...');
        const adminEmail = 'admin@admin.com';
        const existingAdmin = await prisma.user.findUnique({
            where: { email: adminEmail },
        });
        if (existingAdmin) {
            console.log('Usuário admin já existe. Nenhuma ação necessária.');
            return;
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
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
    }
    catch (error) {
        console.error('Erro ao criar usuário admin:', error);
    }
    finally {
        await prisma.$disconnect();
    }
}
createAdminUser();
//# sourceMappingURL=create-admin.js.map