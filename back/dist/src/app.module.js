"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const prisma_module_1 = require("./prisma/prisma.module");
const prisma_service_1 = require("./prisma/prisma.service");
const users_module_1 = require("./users/users.module");
const auth_1 = require("./auth");
const core_1 = require("@nestjs/core");
const validation_exception_filter_1 = require("./common/filters/validation-exception.filter");
const clients_module_1 = require("./clients/clients.module");
const appointments_module_1 = require("./appointments/appointments.module");
const kanban_module_1 = require("./kanban/kanban.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            users_module_1.UsersModule,
            auth_1.AuthModule,
            prisma_module_1.PrismaModule,
            clients_module_1.ClientsModule,
            appointments_module_1.AppointmentsModule,
            kanban_module_1.KanbanModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            prisma_service_1.PrismaService,
            {
                provide: core_1.APP_FILTER,
                useClass: validation_exception_filter_1.ValidationExceptionFilter,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map