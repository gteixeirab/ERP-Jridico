"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('jwt', () => ({
    secret: process.env.JWT_SECRET || 'seuSegredoMuitoSeguroAqui',
    expiresIn: process.env.JWT_EXPIRATION || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'seuRefreshTokenSeguroAqui',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
}));
//# sourceMappingURL=jwt.config.js.map