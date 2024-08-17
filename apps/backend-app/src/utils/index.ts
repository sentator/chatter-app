import { Request } from 'express';

export const extractTokenFromHeader = (
  request: Request
): string | undefined => {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
};

export const extractRefreshTokenFromCookies = (req: Request) => {
  return req.cookies.refreshToken;
};
