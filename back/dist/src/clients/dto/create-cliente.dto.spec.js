"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const create_cliente_dto_1 = require("./create-cliente.dto");
describe('CreateClienteDto', () => {
    it('should validate required fields', async () => {
        const dto = new create_cliente_dto_1.CreateClienteDto();
        dto.name = 'Fulano de Tal';
        dto.type = 'PESSOA_FISICA';
        dto.document = '123.456.789-09';
        dto.email = 'fulano@example.com';
        const errors = await (0, class_validator_1.validate)(dto);
        expect(errors.length).toBe(0);
    });
    it('should fail if name is empty', async () => {
        const dto = new create_cliente_dto_1.CreateClienteDto();
        dto.type = 'PESSOA_FISICA';
        dto.document = '123.456.789-09';
        const errors = await (0, class_validator_1.validate)(dto);
        expect(errors.some(e => e.property === 'name')).toBeTruthy();
    });
    it('should fail if type is invalid', async () => {
        const dto = new create_cliente_dto_1.CreateClienteDto();
        dto.name = 'Fulano de Tal';
        dto.type = 'INVALID_TYPE';
        dto.document = '123.456.789-09';
        const errors = await (0, class_validator_1.validate)(dto);
        expect(errors.some(e => e.property === 'type')).toBeTruthy();
    });
    it('should transform plain object to class instance', () => {
        const plain = {
            name: 'Fulano de Tal',
            type: 'PESSOA_FISICA',
            document: '123.456.789-09',
            email: 'fulano@example.com',
            address: {
                street: 'Rua Exemplo',
                number: '123',
                city: 'São Paulo',
                state: 'SP'
            }
        };
        const dto = (0, class_transformer_1.plainToInstance)(create_cliente_dto_1.CreateClienteDto, plain);
        expect(dto).toBeInstanceOf(create_cliente_dto_1.CreateClienteDto);
        expect(dto.name).toBe(plain.name);
        expect(dto.address).toBeDefined();
        expect(dto.address.street).toBe(plain.address.street);
    });
});
//# sourceMappingURL=create-cliente.dto.spec.js.map