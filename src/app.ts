import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { usersRouter } from './routers/users.router.js';
import createDebug from 'debug';
import { errorsMiddleware } from './middleware/errors.middleware.js';
import { guitarsRouter } from './routers/guitars.router.js';

const debug = createDebug('GW:app');

debug('app-initiated');

export const app = express();

const corsOptions = {
  origin: '*',
};

app.disable('x-powered-by');
app.use(morgan('dev'));
app.use(express.json());
app.use(cors(corsOptions));

app.use('/users', usersRouter);
app.use('/guitars', guitarsRouter);

app.use(errorsMiddleware);

app.get('/', (_req, resp) => {
  resp.json({
    info: 'Guitars World',
    endpoints: {
      users: '/users',
      guitars: '/guitars',
    },
  });
});
