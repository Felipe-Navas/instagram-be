/* eslint-disable promise/no-nesting */
import { Request, Response } from 'express';

import { PostModel, UserModel } from '../models';

// endpoint to get user details of another user(not the loggedin user) along with their posts
export const getUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'User ID not provided!' });
  }

  UserModel.findOne({ _id: userId })
    // gets everything except password
    .select('-password')
    .then((userFound) => {
      // get all the posts of this found user
      PostModel.find({ author: userId })
        .populate('author', '_id fullName')
        .then((allPosts) => {
          res.status(200).json({ user: userFound, posts: allPosts });
        })
        .catch((err) => {
          if (err) {
            console.log(err);
            return res.status(400).json({ error: 'Post was not found!' });
          }
        });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({ error: 'User was not found!' });
    });
};
