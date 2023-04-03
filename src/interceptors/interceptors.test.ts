import { NextFunction, Response } from 'express';
import { Interceptors, RequestWithToken } from './interceptors';

jest.mock('../helpers/auth.js');

describe('Given Interceptors class', () => {
  const req = {
    get: jest.fn(),
  } as unknown as RequestWithToken;

  const resp = {} as unknown as Response;

  const next = jest.fn() as unknown as NextFunction;

  describe('When the Logged method is called', () => {
    test('Then if req.get return undefined, it should be catch and call next function', () => {
      (req.get as jest.Mock).mockReturnValue('');

      Interceptors.logged(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then if req.get return string that does not start with Bearer, it should be catch and call next function', () => {
      (req.get as jest.Mock).mockReturnValue('Test');

      Interceptors.logged(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then if the header Authorization is Ok, it should call next function', () => {
      (req.get as jest.Mock).mockReturnValue('Bearer Test');

      Interceptors.logged(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When the Admin method is called', () => {
    test('Then if the req.tokenInfo.role is Admin, next function should be called', () => {
      const req = {
        tokenInfo: {
          role: 'Admin',
        },
      } as unknown as RequestWithToken;

      Interceptors.admin(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then if there is no req.tokenInfo, it should be catch and call next function', () => {
      const req = {
        tokenInfo: undefined,
      } as unknown as RequestWithToken;

      Interceptors.admin(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then if the req.tokenInfo.role is NOT Admin, it should be catch and call next function', () => {
      const req = {
        tokenInfo: {
          role: 'User',
        },
      } as unknown as RequestWithToken;

      Interceptors.admin(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When the Authorized method is called', () => {
    test('Then if the user information is completed, it should return the resp.json', () => {
      const req = {
        tokenInfo: { id: '1' },
        params: { id: '1' },
        body: { id: '1' },
      } as unknown as RequestWithToken;

      Interceptors.authorized(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then if the req.info is undefined, it should be catch the error and next function have been called', () => {
      const req = {
        tokenInfo: undefined,
      } as unknown as RequestWithToken;

      Interceptors.authorized(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then if the req.params.id is undefined, it should be catch the error and next function have been called', () => {
      const req = {
        tokenInfo: { id: '1' },
        params: { id: undefined },
      } as unknown as RequestWithToken;

      Interceptors.authorized(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then if the req.info.id is not equal to req.params.id, it should be catch the error and next function have been called', () => {
      const req = {
        tokenInfo: { id: '1' },
        params: { id: '2' },
      } as unknown as RequestWithToken;

      Interceptors.authorized(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
