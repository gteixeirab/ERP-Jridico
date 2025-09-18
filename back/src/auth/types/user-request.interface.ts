export interface UserRequest extends Request {
  user: {
    userId: string;
    email: string;
    [key: string]: any; // Para permitir outras propriedades que possam vir do token
  };
}
