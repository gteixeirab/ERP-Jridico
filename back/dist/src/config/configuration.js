"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
        host: process.env.DATABASE_URL || 'file:./dev.db',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'seuSegredoMuitoSeguroAqui',
        expiresIn: process.env.JWT_EXPIRATION || '15m',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'seuRefreshTokenSeguroAqui',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
    },
});
//# sourceMappingURL=configuration.js.map