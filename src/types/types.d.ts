import { Request } from 'express';
import mongoose from 'mongoose';

export interface User {
  _id: typeof mongoose.Schema.Types.ObjectId;
  fullName: string;
  email: string;
  password: string;
  profilePicUrl?: string;
  followers: (typeof mongoose.Schema.Types.ObjectId)[];
  following: (typeof mongoose.Schema.Types.ObjectId)[];
}

export interface Post {
  title: string;
  body: string;
  image: string;
  likes: (typeof mongoose.Schema.Types.ObjectId)[];
  comments: {
    commentText: string;
    commentedBy: typeof mongoose.Schema.Types.ObjectId;
  }[];
  author: typeof mongoose.Schema.Types.ObjectId;
}

export interface UserReq extends Request {
  dbUser: User;
}
