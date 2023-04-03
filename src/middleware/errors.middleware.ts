/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { CustomError, HTTPError } from '../errors/errors.js';
import createDebug from 'debug';
import { Error as MongooseError } from 'mongoose';

const debug = createDebug('GW:errorsMiddleware');

export const errorsMiddleware = (
  error: CustomError | Error,
  _req: Request,
  resp: Response,
  _next: NextFunction
) => {
  let status = 500;
  let statusMessage = 'Internal server error';

  if (error instanceof HTTPError) {
    status = error.statusCode;
    statusMessage = error.statusMessage;
  }

  if (error instanceof MongooseError.CastError) {
    status = 400;
    statusMessage = 'Bad formatted data in the request';
  }

  if (error instanceof MongooseError.ValidationError) {
    status = 406;
    statusMessage = 'Validation error in the request';
  }

  resp.status(status);

  resp.json({
    error: [
      {
        status,
        statusMessage,
      },
    ],
  });

  debug(status, statusMessage, error.message);
};
