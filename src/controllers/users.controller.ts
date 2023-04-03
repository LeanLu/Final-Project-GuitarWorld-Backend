import { UserStructure } from '../entities/user.model';
import { Repo } from '../repositories/repo.interface';
import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../errors/errors.js';
import { Auth } from '../helpers/auth.js';
import { TokenPayload } from '../helpers/token.payload.interface';
import { RequestWithToken } from '../interceptors/interceptors';
import { GuitarStructure } from '../entities/guitar.model';

const debug = createDebug('GW:users-controller');

export class UsersController {
  constructor(
    public usersRepo: Repo<UserStructure>,
    public guitarsRepo: Repo<GuitarStructure>
  ) {
    this.usersRepo = usersRepo;
    this.guitarsRepo = guitarsRepo;

    debug('users-controller-instanced');
  }

  async register(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('register-method');

      if (!req.body.username || !req.body.password)
        throw new HTTPError(401, 'Unauthorized', 'Invalid username o password');

      req.body.password = await Auth.hash(req.body.password);

      req.body.myGuitars = [];
      req.body.role = 'User';

      const data = await this.usersRepo.create(req.body);

      resp.status(201);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('login-method');

      if (!req.body.username || !req.body.password)
        throw new HTTPError(
          401,
          'Unauthorized',
          'Invalid User Name o password'
        );

      const data = await this.usersRepo.search({
        key: 'username',
        value: req.body.username,
      });

      if (!data.length)
        throw new HTTPError(401, 'Unauthorized', 'Username not found');

      if (!(await Auth.compare(req.body.password, data[0].password)))
        throw new HTTPError(401, 'Unauthorized', 'Password does not match');

      const payload: TokenPayload = {
        id: data[0].id,
        username: data[0].username,
        role: data[0].role,
      };

      const token = Auth.createJWT(payload);
      const loggedUser = data[0];
      loggedUser.token = token;

      resp.status(202);
      resp.json({
        results: [loggedUser],
      });
    } catch (error) {
      next(error);
    }
  }

  async getId(req: RequestWithToken, resp: Response, next: NextFunction) {
    try {
      debug('getId-method');

      if (!req.tokenInfo)
        throw new HTTPError(498, 'Token not found', 'Token not found');

      if (!req.params.idUser)
        throw new HTTPError(404, 'Not found', 'Not found user ID in params');

      if (req.tokenInfo.id !== req.params.idUser)
        throw new HTTPError(
          401,
          'Unauthorized',
          'The ID from params is not equal to ID from Token'
        );

      const userId = req.params.idUser;

      const data = await this.usersRepo.readId(userId);

      resp.status(202);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async addGuitar(req: RequestWithToken, resp: Response, next: NextFunction) {
    try {
      debug('addGuitar method');

      if (!req.tokenInfo)
        throw new HTTPError(498, 'Token not found', 'Token not found');

      const actualUser = await this.usersRepo.readId(req.tokenInfo.id);

      if (!req.params.idGuitar)
        throw new HTTPError(404, 'Not found', 'Not found guitar ID in params');

      const guitarToAdd = await this.guitarsRepo.readId(req.params.idGuitar);

      if (!guitarToAdd)
        throw new HTTPError(400, 'Not found', 'Not found guitar ID');

      if (actualUser.myGuitars.find((item) => item.id === guitarToAdd.id))
        throw new HTTPError(
          405,
          'Not allowed',
          'This guitar is already added as MyGuitars'
        );

      actualUser.myGuitars.push(guitarToAdd);

      await this.usersRepo.update(actualUser);

      resp.status(202);
      resp.json({
        results: [actualUser],
      });
    } catch (error) {
      next(error);
    }
  }

  async removeGuitar(
    req: RequestWithToken,
    resp: Response,
    next: NextFunction
  ) {
    try {
      debug('removeGuitar method');

      if (!req.tokenInfo)
        throw new HTTPError(498, 'Token not found', 'Token not found');

      const actualUser = await this.usersRepo.readId(req.tokenInfo.id);

      if (!req.params.idGuitar)
        throw new HTTPError(404, 'Not found', 'Not found guitar ID in params');

      const guitarToRemove = await this.guitarsRepo.readId(req.params.idGuitar);

      if (!guitarToRemove)
        throw new HTTPError(400, 'Not found', 'Not found guitar ID');

      actualUser.myGuitars = actualUser.myGuitars.filter(
        (item) => item.id !== guitarToRemove.id
      );

      await this.usersRepo.update(actualUser);

      resp.status(202);
      resp.json({
        results: [actualUser],
      });
    } catch (error) {
      next(error);
    }
  }
}
