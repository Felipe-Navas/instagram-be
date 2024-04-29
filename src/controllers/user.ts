import { Request, Response } from 'express';
import mongoose from 'mongoose';

import { PostModel, UserModel } from '../models';
import { UserReq } from '../types/types';

// endpoint to get user details of another user(not the loggedin user) along with their posts
export const getUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) return res.status(400).json({ error: 'User ID not provided!' });

  if (!mongoose.isValidObjectId(userId))
    return res.status(400).json({ error: 'User ID not valid!' });

  const userFound = await UserModel.findOne({ _id: userId })
    // gets everything except password
    .select('-password')
    .catch((err) => {
      console.log(err);
      return res.status(400).json({ error: 'User was not found!' });
    });

  // get all the posts of this found user
  const allPosts = await PostModel.find({ author: userId })
    .populate('author', '_id fullName')
    .catch((err) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'Post was not found!' });
      }
    });

  return res.status(200).json({ user: userFound, posts: allPosts });
};

export const followUser = async (req: Request, res: Response) => {
  // Scenario: Loggedin user is trying to follow another user

  const userLogeddIn = (req as UserReq).dbUser._id;

  // TODO: Validate that the user does not have the loggedId

  await UserModel.findByIdAndUpdate(
    req.body.followId,
    {
      // push the userid of loggedin user
      $push: { followers: userLogeddIn }
    },
    {
      new: true
    }
  ).catch((error) => {
    return res
      .status(400)
      .json({ msg: 'Error trying to add to followers', error });
  });

  // TODO: Validate that the user logged in does not have the user that wants to follow

  // req.dbUser._id = userId of loggedin user
  UserModel.findByIdAndUpdate(
    userLogeddIn,
    {
      // push the userid of not loggedin user
      $push: { following: req.body.followId }
    },
    { new: true }
  )
    .select('-password')
    .then((result) => res.json(result))
    .catch((error) => {
      return res
        .status(400)
        .json({ msg: 'Error trying to add to following', error });
    });
};

export const unfollowUser = async (req: Request, res: Response) => {
  // Scenario: Loggedin user is trying to follow a non-loggedin user

  const userLogeddIn = (req as UserReq).dbUser._id;

  // TODO: Validate that the user does not have the loggedId

  await UserModel.findByIdAndUpdate(
    req.body.unfollowId,
    {
      // push the userid of loggedin user
      $pull: { followers: userLogeddIn }
    },
    {
      new: true
    }
  ).catch((error) => {
    return res
      .status(400)
      .json({ msg: 'Error trying to remove from followers', error });
  });

  // TODO: Validate that the user logged in does not have the user that wants to follow

  // req.dbUser._id = userId of loggedin user
  UserModel.findByIdAndUpdate(
    userLogeddIn,
    {
      // push the userId of not loggedin user
      $pull: { following: req.body.unfollowId }
    },
    { new: true }
  )
    .select('-password')
    .then((result) => res.json(result))
    .catch((error) => {
      return res
        .status(400)
        .json({ msg: 'Error trying to remove from following', error });
    });
};
