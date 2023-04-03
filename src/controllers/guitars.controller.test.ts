import { GuitarsController } from './guitars.controller';
import { NextFunction, Request, Response } from 'express';
import { GuitarStructure } from '../entities/guitar.model';
import { Repo } from '../repositories/repo.interface';

describe('Given the controller GuitarsController', () => {
  const mockGuitarRepo = {
    read: jest.fn(),
    readId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    erase: jest.fn(),
    search: jest.fn(),
  } as unknown as Repo<GuitarStructure>;

  const controller = new GuitarsController(mockGuitarRepo);

  const resp = {
    json: jest.fn(),
    status: jest.fn(),
  } as unknown as Response;

  const next = jest.fn() as unknown as NextFunction;

  describe('When Post method is called', () => {
    test('Then if the guitar information is completed, it should return the resp.status and resp.json', async () => {
      const req = {
        body: {
          brand: 'test',
          style: 'Electric',
        },
      } as unknown as Request;

      await controller.post(req, resp, next);
      expect(mockGuitarRepo.create).toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if there is req.body.style is not Electric or Acoustic, it should be catch the error and next function have been called', async () => {
      const req = {
        body: {
          style: 'test',
        },
      } as unknown as Request;

      await controller.post(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then if the guitar repo create resolved with Error, it should be catch the error and next function have been called', async () => {
      const req = {
        body: {
          style: 'test',
        },
      } as unknown as Request;

      (mockGuitarRepo.create as jest.Mock).mockRejectedValueOnce(
        'No guitar info'
      );
      await controller.post(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When Get method is called', () => {
    (mockGuitarRepo.read as jest.Mock).mockResolvedValue([
      { id: '1' },
      { id: '2' },
      { id: '3' },
    ]);

    (mockGuitarRepo.search as jest.Mock).mockResolvedValue([
      { id: '1' },
      { id: '2' },
      { id: '3' },
    ]);

    test('Then if the guitar information is completed, it should return the resp.status and resp.json', async () => {
      const req = {
        query: {
          page: '1',
          style: 'Electric',
        },
      } as unknown as Request;

      await controller.get(req, resp, next);
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if there is no information in req.query, it should return the resp.status and resp.json with the req.query default values', async () => {
      const req = {
        query: {
          page: undefined,
          style: undefined,
        },
      } as unknown as Request;

      await controller.get(req, resp, next);
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if req.body.page is less than 1, it should be catch the error and next function have been called', async () => {
      const req = {
        query: {
          page: '0',
        },
      } as unknown as Request;

      await controller.get(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then if req.body.page is more than 7, it should be catch the error and next function have been called', async () => {
      const req = {
        query: {
          page: '8',
        },
      } as unknown as Request;

      await controller.get(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then if req.body.style is not Electric or Acoustic or All, it should be catch the error and next function have been called', async () => {
      const req = {
        query: {
          style: 'test',
        },
      } as unknown as Request;

      await controller.get(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When getId method is called', () => {
    test('Then if the user information is completed, it should return the resp.status and resp.json', async () => {
      const req = {
        params: {
          idGuitar: '1',
        },
      } as unknown as Request;

      await controller.getId(req, resp, next);
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if there is no the guitar id in the req.params, it should be catch the error and next function have been called', async () => {
      const req = {
        params: {
          idGuitar: undefined,
        },
      } as unknown as Request;

      await controller.getId(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When edit method is called', () => {
    test('Then if the user information is completed, it should return the resp.status and resp.json', async () => {
      const req = {
        body: {
          id: '1',
        },
        params: {
          idGuitar: '1',
        },
      } as unknown as Request;

      await controller.edit(req, resp, next);
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if there is no the guitar id in the req.params, it should be catch the error and next function have been called', async () => {
      const req = {
        params: {
          idGuitar: undefined,
        },
      } as unknown as Request;

      await controller.edit(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When delete method is called', () => {
    test('Then if the user information is completed, it should return the resp.status and resp.json', async () => {
      const req = {
        params: {
          idGuitar: '1',
        },
      } as unknown as Request;

      await controller.delete(req, resp, next);
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if there is no the guitar id in the req.params, it should be catch the error and next function have been called', async () => {
      const req = {
        params: {
          idGuitar: undefined,
        },
      } as unknown as Request;

      await controller.delete(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
