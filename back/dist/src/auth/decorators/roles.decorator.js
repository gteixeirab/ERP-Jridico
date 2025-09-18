"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roles = exports.ROLES_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.ROLES_KEY = 'roles';
const Roles = (...roles) => {
    if (!roles || roles.length === 0) {
        throw new Error('Pelo menos uma role deve ser fornecida');
    }
    return (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
};
exports.Roles = Roles;
//# sourceMappingURL=roles.decorator.js.map