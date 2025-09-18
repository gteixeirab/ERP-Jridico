"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
async function checkTestUser() {
    const prisma = new client_1.PrismaClient();
    try {
        const user = await prisma.user.findUnique({
            where: { email: 'test@example.com' },
            select: {
                id: true,
                email: true,
                password: true,
                name: true
            }
        });
        console.log('Usuário de teste encontrado:', user);
    }
    catch (error) {
        console.error('Erro ao buscar usuário de teste:', error);
    }
    finally {
        await prisma.$disconnect();
    }
}
checkTestUser();
//# sourceMappingURL=check-test-user.js.map