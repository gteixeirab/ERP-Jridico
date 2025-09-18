export declare class CreateClientDto {
    name: string;
    document: string;
    email: string;
    phone?: string;
    mobile?: string;
    type: 'PESSOA_FISICA' | 'PESSOA_JURIDICA';
    isActive?: boolean;
}
