import { Router as router } from 'express';
import { GuitarsController } from '../controllers/guitars.controller.js';
import { GuitarsMongoRepo } from '../repositories/guitars.mongo.repo.js';
import createDebug from 'debug';
import { Interceptors } from '../interceptors/interceptors.js';

const debug = createDebug('GW:router');
debug('guitars-router');

export const guitarsRouter = router();
const guitarsRepo = new GuitarsMongoRepo();
const controller = new GuitarsController(guitarsRepo);

guitarsRouter.get(
  '/products',
  Interceptors.logged,
  controller.get.bind(controller)
);

guitarsRouter.get(
  '/details/:idGuitar',
  Interceptors.logged,
  controller.getId.bind(controller)
);

guitarsRouter.post(
  '/create',
  Interceptors.logged,
  Interceptors.admin,
  controller.post.bind(controller)
);

guitarsRouter.patch(
  '/edit/:idGuitar',
  Interceptors.logged,
  Interceptors.admin,
  controller.edit.bind(controller)
);

guitarsRouter.delete(
  '/delete/:idGuitar',
  Interceptors.logged,
  Interceptors.admin,
  controller.delete.bind(controller)
);
