import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import bcrypt from 'bcryptjs';
import { HTTPError } from '../errors/errors.js';
import { TokenPayload } from './token.payload.interface.js';

const salt = 10;

export class Auth {
  static createJWT(payload: TokenPayload) {
    return jwt.sign(payload, config.SECRET as string);
  }

  static verifyJWT(token: string): TokenPayload {
    const tokenInfo = jwt.verify(token, config.SECRET as string);

    if (typeof tokenInfo === 'string')
      throw new HTTPError(498, 'Invalid Token', tokenInfo);

    return tokenInfo as TokenPayload;
  }

  static hash(value: string) {
    return bcrypt.hash(value, salt);
  }

  static compare(value: string, hash: string) {
    return bcrypt.compare(value, hash);
  }
}
