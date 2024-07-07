import jwt from 'jsonwebtoken';
import CONFIG from '../config/env';
import { findUserByEmail } from '../services/auth.service';

export const signJWT = (payload: Object, options?: jwt.SignOptions | undefined) => {
  if (!CONFIG.jwt_private) {
    throw new Error('Private key for JWT is not defined');
  }

  return jwt.sign(payload, CONFIG.jwt_private, {
    ...(options && options),
    algorithm: 'RS256'
  });
};

export const verifyJWT = (token: string) => {
  if (!CONFIG.jwt_public) {
    throw new Error('Public key for JWT verification is not defined');
  }

  try {
    const decoded = jwt.verify(token, CONFIG.jwt_public);

    return {
      valid: true,
      expired: false,
      decoded
    };
  } catch (error: any) {
    return {
      valid: false,
      expired: error.message === 'jwt is expired or not eligible to use',
      decoded: null
    };
  }
};

export const reIssueAccessToken = async (refreshToken: string) => {
  const { decoded }: any = verifyJWT(refreshToken);

  const user = await findUserByEmail(decoded._doc.email);

  if (!user) return false;

  const accessToken = signJWT(
    {
      ...user
    },
    {
      expiresIn: '1d'
    }
  );

  return accessToken;
};
