import { Request } from 'express';
import bcrypt from 'bcrypt';
import { BCRYPT_SALT_OR_ROUNDS } from '../constants';

export const extractTokenFromHeader = (
  request: Request
): string | undefined => {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
};

export const extractRefreshTokenFromCookies = (req: Request) => {
  return req.cookies.refreshToken;
};

export const getHashedValue = async (value: string) => {
  const hash = await bcrypt.hash(value, BCRYPT_SALT_OR_ROUNDS);
  return hash;
};

export const compareValueWithHash = async (
  value: string,
  hashedValue: string
) => {
  const isEqual = await bcrypt.compare(value, hashedValue);
  return isEqual;
};
