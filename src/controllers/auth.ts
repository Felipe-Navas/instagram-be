import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
// import protectedResource from '../middleware/protectedResource';

const UserModel = mongoose.model('UserModel');

const JWT_SECRET = process.env.SECRET_JWT_SEED || Math.random().toString();

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
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
      bcrypt
        .compare(password, dbUser.password)
        .then((didMatch) => {
          if (didMatch) {
            // res.status(200).json({ result: "User Logged In successfully" });
            // create and send a token
            const jwtToken = jwt.sign({ _id: dbUser._id }, JWT_SECRET);
            const {
              _id,
              fullName,
              email,
              followers,
              following,
              profilePicUrl
            } = dbUser;
            res.json({
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
    })
    .catch((error) => {
      console.log(error);
    });
};

export const register = async (req: Request, res: Response) => {
  const { fullName, email, password, profilePicUrl } = req.body;

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
      bcrypt.hash(password, 16).then((hashedPassword) => {
        const user = new UserModel({
          fullName,
          email,
          password: hashedPassword,
          profilePicUrl
        });
        user
          .save()
          .then((u) => {
            res.status(201).json({ result: 'User Registered successfully' });
          })
          .catch((error) => {
            console.log(error);
          });
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
