import { Router as router } from 'express';
import { UsersController } from '../controllers/users.controller.js';
import { UsersMongoRepo } from '../repositories/users.mongo.repo.js';
import createDebug from 'debug';
import { Interceptors } from '../interceptors/interceptors.js';
import { GuitarsMongoRepo } from '../repositories/guitars.mongo.repo.js';

const debug = createDebug('GW:router');
debug('users-router');

export const usersRouter = router();
const usersRepo = new UsersMongoRepo();
const guitarsRepo = new GuitarsMongoRepo();
const controller = new UsersController(usersRepo, guitarsRepo);

usersRouter.post('/register', controller.register.bind(controller));
usersRouter.post('/login', controller.login.bind(controller));

usersRouter.get(
  '/:idUser',
  Interceptors.logged,
  controller.getId.bind(controller)
);

usersRouter.patch(
  '/add/cart/:idGuitar',
  Interceptors.logged,
  controller.addGuitar.bind(controller)
);

usersRouter.patch(
  '/remove/cart/:idGuitar',
  Interceptors.logged,
  controller.removeGuitar.bind(controller)
);
