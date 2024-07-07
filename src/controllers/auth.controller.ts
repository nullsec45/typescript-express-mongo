import type { Request, Response } from 'express';
import {
  createRefreshTokenValidation,
  createSessionValidation,
  createUserValidation
} from '../validations/auth.validation';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';
import { checkPassword, hashing } from '../utils/hashing';
import { createUser, findUserByEmail } from '../services/auth.service';
// import UserType from '../types/user.type';
import { signJWT, reIssueAccessToken } from '../utils/jwt';

export const registerUser = async (req: Request, res: Response) => {
  req.body.user_id = uuidv4();
  const { error, value } = createUserValidation(req.body);

  if (error) {
    logger.error('ERR : auth - register =', error.details[0].message);
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message });
  }

  try {
    value.password = `${hashing(value.password)}`;

    await createUser(value);
    logger.info('Success register');
    return res.status(201).json({ status: true, statusCode: 201, message: 'Success register fulled' });
  } catch (error) {
    logger.error('ERR : auth - register = ', error);
    return res.status(422).json({ status: false, statusCode: 422, message: 'Faileds  register' });
  }
};

export const createSession = async (req: Request, res: Response) => {
  const { error, value } = createSessionValidation(req.body);

  if (error) {
    logger.error('ERR : auth - login =', error.details[0].message);
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message });
  }

  try {
    const user: any = await findUserByEmail(value.email);
    const isPasswordValid = checkPassword(value.password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ status: false, statusCode: 401, message: 'Invalid email or password' });
    }

    const accessToken = signJWT({ ...user }, { expiresIn: '15s' });

    const refreshToken = signJWT({ ...user }, { expiresIn: '1y' });

    logger.info('Success login');
    return res
      .status(200)
      .send({ status: true, statusCode: 200, message: 'Login Success', data: { accessToken, refreshToken } });
  } catch (error: any) {
    logger.error('ERR : auth - login = ', error.message);
    return res.status(422).json({ status: false, statusCode: 422, message: error.message });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const { error, value } = createRefreshTokenValidation(req.body);

  if (error) {
    logger.error('ERR : auth - refresh token =', error.details[0].message);
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message });
  }

  try {
    const accessToken = await reIssueAccessToken(value.refresh_token);

    if (!accessToken) return res.status(404).send({ status: false, statusCode: 404, message: 'User Not Found' });

    logger.info('Success refresh token');
    return res
      .status(200)
      .send({ status: true, statusCode: 200, message: 'Refresh Token Berhasil', data: { accessToken } });
  } catch (error: any) {
    logger.error('ERR : auth - refresh token =', error.message);
    return res.status(422).send({ status: false, statusCode: 422, message: error.message });
  }
};
