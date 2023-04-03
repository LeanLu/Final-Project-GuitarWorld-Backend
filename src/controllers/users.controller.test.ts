import { UsersController } from './users.controller';
import { NextFunction, Request, Response } from 'express';
import { UserStructure } from '../entities/user.model';
import { Repo } from '../repositories/repo.interface';
import { Auth } from '../helpers/auth.js';
import { GuitarStructure } from '../entities/guitar.model';
import { RequestWithToken } from '../interceptors/interceptors';

jest.mock('../helpers/auth.js');

describe('Given the controller UsersController', () => {
  const mockUserRepo = {
    read: jest.fn(),
    readId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    erase: jest.fn(),
    search: jest.fn(),
  } as unknown as Repo<UserStructure>;

  const mockGuitarRepo = {
    readId: jest.fn(),
  } as unknown as Repo<GuitarStructure>;

  const controller = new UsersController(mockUserRepo, mockGuitarRepo);

  const resp = {
    json: jest.fn(),
    status: jest.fn(),
  } as unknown as Response;

  const next = jest.fn() as unknown as NextFunction;

  describe('When Register method is called', () => {
    test('Then if the user information is completed, it should return the resp.status and resp.json', async () => {
      const req = {
        body: {
          username: 'test',
          password: 'test',
        },
      } as unknown as Request;

      await controller.register(req, resp, next);
      expect(mockUserRepo.create).toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if there is no username in the body user information, it should be catch the error and next function have been called', async () => {
      const req = {
        body: {
          password: 'test',
        },
      } as unknown as Request;

      await controller.register(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then if there is no password in the body user information, it should be catch the error and next function have been called', async () => {
      const req = {
        body: {
          username: 'test',
        },
      } as unknown as Request;

      await controller.register(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When Login method is called', () => {
    test('Then if the user information is completed, it should return the resp.status and resp.json', async () => {
      const req = {
        body: {
          username: 'test',
          password: 'test',
        },
      } as unknown as Request;

      (mockUserRepo.search as jest.Mock).mockResolvedValue([
        { username: 'test' },
      ]);

      Auth.compare = jest.fn().mockResolvedValue(true);
      Auth.createJWT = jest.fn().mockResolvedValue('test');

      await controller.login(req, resp, next);
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if there is no username in the user information, it should be catch the error and next function have been called', async () => {
      const req = {
        body: {
          password: 'test',
        },
      } as unknown as Request;

      await controller.login(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then if there is no password in the user information, it should be catch the error and next function have been called', async () => {
      const req = {
        body: {
          username: 'test',
        },
      } as unknown as Request;

      await controller.login(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then if the user information is complete but the search method return an empty array, it should be catch the error and next function have been called', async () => {
      const req = {
        body: {
          username: 'test',
          password: 'test',
        },
      } as unknown as Request;

      (mockUserRepo.search as jest.Mock).mockResolvedValue([]);

      await controller.login(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then if the user information is complete but the compare method of Auth return false, it should be catch the error and next function have been called', async () => {
      const req = {
        body: {
          username: 'test',
          password: 'test',
        },
      } as unknown as Request;

      (mockUserRepo.search as jest.Mock).mockResolvedValue(['test']);

      Auth.compare = jest.fn().mockResolvedValue(false);

      await controller.login(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When getId method is called', () => {
    test('Then if the user information is completed, it should return the resp.status and resp.json', async () => {
      const req = {
        tokenInfo: {
          id: '1',
        },
        params: {
          idUser: '1',
        },
      } as unknown as RequestWithToken;

      await controller.getId(req, resp, next);
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if there is no tokenInfo in the req information, it should be catch the error and next function have been called', async () => {
      const req = {
        tokenInfo: undefined,
      } as unknown as RequestWithToken;

      await controller.getId(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then if there is no the user id in the req.params, it should be catch the error and next function have been called', async () => {
      const req = {
        tokenInfo: {
          id: '1',
        },
        params: {
          idUser: undefined,
        },
      } as unknown as RequestWithToken;

      await controller.getId(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then if the id in the tokenInfo is not equal to user id in req.params, it should be catch the error and next function have been called', async () => {
      const req = {
        tokenInfo: {
          id: '1',
        },
        params: {
          idUser: '2',
        },
      } as unknown as RequestWithToken;

      await controller.getId(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When addGuitar method is called', () => {
    test('Then if the user information is completed, it should return the resp.status and resp.json', async () => {
      const req = {
        tokenInfo: {
          id: '1',
        },
        params: {
          idGuitar: '20',
        },
      } as unknown as RequestWithToken;

      (mockUserRepo.readId as jest.Mock).mockResolvedValue({
        myGuitars: [{ id: '10' }],
      });
      (mockGuitarRepo.readId as jest.Mock).mockResolvedValue({ id: '20' });

      await controller.addGuitar(req, resp, next);
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if there is no tokenInfo in the req information, it should be catch the error and next function have been called', async () => {
      const req = {
        tokenInfo: undefined,
      } as unknown as RequestWithToken;

      await controller.addGuitar(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then if there is no the guitar id in the req.params, it should be catch the error and next function have been called', async () => {
      const req = {
        tokenInfo: {
          id: '1',
        },
        params: {
          idGuitar: undefined,
        },
      } as unknown as RequestWithToken;

      await controller.addGuitar(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then if the id of the guitar is incorrect and can not be find for the guitar repo, it should be catch the error and next function have been called', async () => {
      const req = {
        tokenInfo: {
          id: '1',
        },
        params: {
          idGuitar: '20',
        },
      } as unknown as RequestWithToken;

      (mockGuitarRepo.readId as jest.Mock).mockResolvedValue(undefined);

      await controller.addGuitar(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then if the guitar is already added to myGuitars, it should be catch the error and next function have been called', async () => {
      const req = {
        tokenInfo: {
          id: '1',
        },
        params: {
          idGuitar: '20',
        },
      } as unknown as RequestWithToken;

      (mockUserRepo.readId as jest.Mock).mockResolvedValue({
        myGuitars: [{ id: '10' }],
      });
      (mockGuitarRepo.readId as jest.Mock).mockResolvedValue({ id: '10' });

      await controller.addGuitar(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When removeGuitar method is called', () => {
    test('Then if the user information is completed, it should return the resp.status and resp.json', async () => {
      const req = {
        tokenInfo: {
          id: '1',
        },
        params: {
          idGuitar: '20',
        },
      } as unknown as RequestWithToken;

      (mockUserRepo.readId as jest.Mock).mockResolvedValue({
        myGuitars: [{ id: '10' }, { id: '20' }],
      });
      (mockGuitarRepo.readId as jest.Mock).mockResolvedValue({ id: '20' });

      await controller.removeGuitar(req, resp, next);
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if there is no tokenInfo in the req information, it should be catch the error and next function have been called', async () => {
      const req = {
        tokenInfo: undefined,
      } as unknown as RequestWithToken;

      await controller.removeGuitar(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then if there is no the guitar id in the req.params, it should be catch the error and next function have been called', async () => {
      const req = {
        tokenInfo: {
          id: '1',
        },
        params: {
          idGuitar: undefined,
        },
      } as unknown as RequestWithToken;

      await controller.removeGuitar(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then if the id of the guitar is incorrect and can not be find for the guitar repo, it should be catch the error and next function have been called', async () => {
      const req = {
        tokenInfo: {
          id: '1',
        },
        params: {
          idGuitar: '20',
        },
      } as unknown as RequestWithToken;

      (mockGuitarRepo.readId as jest.Mock).mockResolvedValue(undefined);

      await controller.removeGuitar(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
