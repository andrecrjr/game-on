import { AuthService } from './authService';

export * from './authService';
export * from './callbacks';

export const getAuthOptions = (req?: any) => AuthService.getAuthOptions(req);
