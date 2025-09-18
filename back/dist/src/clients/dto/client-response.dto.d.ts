export interface ClientResponseDto {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface ClientsListResponseDto {
    data: ClientResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
