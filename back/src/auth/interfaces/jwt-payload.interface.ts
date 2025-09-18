export interface JwtPayload {
  sub: string;
  userId?: string; // Adicionando userId como opcional para compatibilidade
  email: string;
  [key: string]: any; // Para permitir outras propriedades que possam vir no token
}
