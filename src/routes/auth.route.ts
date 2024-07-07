import { Router } from 'express';
import { registerUser, createSession, refreshToken } from '../controllers/auth.controller';

export const AuthRouter: Router = Router();

AuthRouter.post('/', registerUser);
AuthRouter.post('/login', createSession);
AuthRouter.post('/refresh-token', refreshToken);
