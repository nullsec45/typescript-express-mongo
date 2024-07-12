import { Router } from 'express';
import { registerUser, createSession, refreshToken } from '../controllers/auth.controller';

export const AuthRouter: Router = Router();

AuthRouter.post('/register', registerUser);
AuthRouter.post('/login', createSession);
AuthRouter.post('/refresh-token', refreshToken);
