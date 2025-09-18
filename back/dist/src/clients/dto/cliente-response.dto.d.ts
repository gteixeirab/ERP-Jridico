export declare class ClienteResponseDto {
    id: string;
    name: string;
    document?: string;
    email?: string;
    phone?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<ClienteResponseDto>);
}
