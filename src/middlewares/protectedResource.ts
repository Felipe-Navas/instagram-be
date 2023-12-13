import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../config';
import { User, UserModel } from '../models/User';

interface UserReq extends Request {
  dbUser: User;
}

export const protectedResource = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'User not logged in' });
  }

  const token = authorization.replace('Bearer ', '');

  jwt.verify(token, JWT_SECRET, (error, payload) => {
    if (error) {
      return res.status(401).json({ error: 'User not logged in' });
    }

    const { _id } = payload as { _id: string };
    UserModel.findById(_id)
      .then((dbUser) => {
        if (!dbUser) {
          return res.status(400).json({
            msg: 'User not found'
          });
        }
        (req as UserReq).dbUser = dbUser;

        next();
      })
      .catch((error) => {
        console.error(error);
      });
  });
};
