import jwt from 'jsonwebtoken';

export interface TokenPayload extends jwt.JwtPayload {
  id: string;
  username: string;
  role: string;
}
