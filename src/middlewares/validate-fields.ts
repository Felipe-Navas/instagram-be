import { validationResult } from 'express-validator';
import { Request, Response } from 'express';
import * as express from 'express';

export const validateFields = (
  req: Request,
  res: Response,
  next: express.NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      msg: 'Validation failed',
      errors: errors.mapped()
    });
  }

  return next();
};
