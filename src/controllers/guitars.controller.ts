import { Repo } from '../repositories/repo.interface';
import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { GuitarStructure } from '../entities/guitar.model';
import { HTTPError } from '../errors/errors.js';

const debug = createDebug('GW:guitars-controller');

export class GuitarsController {
  constructor(public guitarsRepo: Repo<GuitarStructure>) {
    this.guitarsRepo = guitarsRepo;

    debug('guitars-controller-instanced');
  }

  async post(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('post-method');

      const newGuitar = req.body;

      if (req.body.style !== 'Electric' && req.body.style !== 'Acoustic')
        throw new HTTPError(
          400,
          'Wrong guitar type',
          'The guitar type is not Electric neither Acoustic'
        );

      const data = await this.guitarsRepo.create(newGuitar);

      resp.status(201);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('get-method');

      const pageString = req.query.page || '1';

      const pageNumber = Number(pageString);

      if (pageNumber < 1 || pageNumber > 7)
        throw new HTTPError(
          400,
          'Wrong page number',
          'The page number in query params is not correct'
        );

      const style = req.query.style || 'All';

      if (style !== 'Electric' && style !== 'Acoustic' && style !== 'All')
        throw new HTTPError(
          400,
          'Wrong style type',
          'The style in query params is not correct'
        );

      const guitarsFiltered: GuitarStructure[] =
        style === 'All'
          ? await this.guitarsRepo.read()
          : await this.guitarsRepo.search({
              key: 'style',
              value: style,
            });

      const guitarsData = guitarsFiltered.slice(
        (pageNumber - 1) * 4,
        pageNumber * 4
      );

      resp.status(201);
      resp.json({
        results: guitarsData,
      });
    } catch (error) {
      next(error);
    }
  }

  async getId(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('getId-method');

      if (!req.params.idGuitar)
        throw new HTTPError(404, 'Not found', 'Not found guitar ID in params');

      const guitarData = await this.guitarsRepo.readId(req.params.idGuitar);

      resp.status(201);
      resp.json({
        results: [guitarData],
      });
    } catch (error) {
      next(error);
    }
  }

  async edit(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('edit-method');

      if (!req.params.idGuitar)
        throw new HTTPError(404, 'Not found', 'Not found guitar ID in params');

      req.body.id = req.params.idGuitar;

      const guitarData = await this.guitarsRepo.update(req.body);

      resp.status(201);
      resp.json({
        results: [guitarData],
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('delete-method');

      if (!req.params.idGuitar)
        throw new HTTPError(404, 'Not found', 'Not found guitar ID in params');

      await this.guitarsRepo.erase(req.params.idGuitar);

      resp.status(201);
      resp.json({
        results: [],
      });
    } catch (error) {
      next(error);
    }
  }
}
