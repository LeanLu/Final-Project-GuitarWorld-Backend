import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../errors/errors.js';
import { Auth } from '../helpers/auth.js';
import createDebug from 'debug';
import { TokenPayload } from '../helpers/token.payload.interface.js';

const debug = createDebug('GW:interceptors');

export interface RequestWithToken extends Request {
  tokenInfo?: TokenPayload;
}

export abstract class Interceptors {
  static logged(req: RequestWithToken, _resp: Response, next: NextFunction) {
    try {
      debug('logged interceptor');

      const authHeader = req.get('Authorization');

      if (!authHeader)
        throw new HTTPError(498, 'Invalid Token', 'Not value in auth header');

      if (!authHeader.startsWith('Bearer'))
        throw new HTTPError(498, 'Invalid Token', 'Not Bearer in auth header');

      const token = authHeader.slice(7);

      const payload = Auth.verifyJWT(token);

      req.tokenInfo = payload;

      next();
    } catch (error) {
      next(error);
    }
  }

  static admin(req: RequestWithToken, _resp: Response, next: NextFunction) {
    try {
      debug('admin interceptor');

      if (!req.tokenInfo)
        throw new HTTPError(
          498,
          'Token not found',
          'Token not found in authorized interceptor'
        );

      if (req.tokenInfo.role !== 'Admin')
        throw new HTTPError(401, 'Unauthorized', 'The user role is not Admin');

      next();
    } catch (error) {
      next(error);
    }
  }

  static authorized(
    req: RequestWithToken,
    _resp: Response,
    next: NextFunction
  ) {
    try {
      debug('Authorized');

      if (!req.tokenInfo)
        throw new HTTPError(
          498,
          'Token not found',
          'Token not found in authorized interceptor'
        );

      if (!req.params.id)
        throw new HTTPError(404, 'Not found', 'Not found user ID in params');

      if (req.tokenInfo?.id !== req.params.id)
        throw new HTTPError(
          401,
          'Unauthorized',
          'The ID from params is not equal to ID from Token'
        );

      req.body.id = req.tokenInfo?.id;

      next();
    } catch (error) {
      next(error);
    }
  }
}
