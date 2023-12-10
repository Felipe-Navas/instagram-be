/* eslint-disable promise/no-nesting */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

import { User } from '../models/User';
// import protectedResource from '../middleware/protectedResource';

const UserModel = mongoose.model<User>('UserModel');

const JWT_SECRET = process.env.SECRET_JWT_SEED || Math.random().toString();

export const login = async (req: Request, res: Response) => {
  const { email, password }: User = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: 'One or more mandatory field is empty' });
  }
  UserModel.findOne({ email })
    .then((dbUser) => {
      if (!dbUser) {
        return res.status(400).json({ error: 'Invalid credentials!' });
      }

      const didMatch = isPasswordValid(password, dbUser.password);

      if (didMatch) {
        const jwtToken = jwt.sign({ _id: dbUser._id }, JWT_SECRET);
        const { _id, fullName, email, followers, following, profilePicUrl } =
          dbUser;
        res.status(200).json({
          token: jwtToken,
          userInfo: {
            _id,
            fullName,
            email,
            followers,
            following,
            profilePicUrl
          }
        });
      } else {
        return res.status(400).json({ error: 'Invalid credentials!' });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const register = async (req: Request, res: Response) => {
  const { fullName, email, password, profilePicUrl }: User = req.body;

  if (!fullName || !password || !email) {
    return res
      .status(400)
      .json({ error: 'One or more mandatory field is empty' });
  }

  UserModel.findOne({ email })
    .then((dbUser) => {
      if (dbUser) {
        return res
          .status(500)
          .json({ error: 'User with email already exist.' });
      }

      const hashedPassword = hashPassword(password);

      if (hashedPassword) {
        const user = new UserModel({
          fullName,
          email,
          password: hashedPassword,
          profilePicUrl
        });

        user
          .save()
          .then((user) => {
            res.status(201).json({ result: 'User Registered successfully' });
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        return res.status(400).json({ error: 'Invalid password!' });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const isPasswordValid = (password: string, userPassword: string): boolean => {
  bcrypt
    .compare(password, userPassword)
    .then((didMatch) => {
      return didMatch;
    })
    .catch((error) => {
      console.log(error);
    });
  return false;
};

const hashPassword = (password: string): string | undefined => {
  bcrypt
    .hash(password, 16)
    .then((hashedPassword) => {
      return hashedPassword;
    })
    .catch((error) => {
      console.log(error);
    });
  return undefined;
};
