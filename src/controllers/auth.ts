/* eslint-disable promise/no-nesting */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

import { User, UserModel } from '../models/User';
import { JWT_SECRET } from '../config';

export const login = async (req: Request, res: Response) => {
  const { email, password }: User = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: 'One or more mandatory field is empty' });
  }
  UserModel.findOne({ email })
    .then(async (dbUser) => {
      if (!dbUser) {
        return res.status(400).json({ error: 'Invalid credentials!' });
      }

      const didMatch = await isPasswordValid(password, dbUser.password);

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
    .then(async (dbUser) => {
      if (dbUser) {
        return res
          .status(500)
          .json({ error: 'User with email already exist.' });
      }

      const hashedPassword = await hashPassword(password);

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

const isPasswordValid = (
  password: string,
  userPassword: string
): Promise<boolean> => bcrypt.compare(password, userPassword);

const hashPassword = async (password: string): Promise<string> =>
  bcrypt.hash(password, 16);
