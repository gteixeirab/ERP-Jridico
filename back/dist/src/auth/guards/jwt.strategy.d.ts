import { UsersService } from '../../users/users.service';
declare const JwtStrategy_base: any;
export declare class JwtStrategy extends JwtStrategy_base {
    private usersService;
    constructor(usersService: UsersService);
    validate(payload: any): Promise<{
        id: string;
        name: string;
        email: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
