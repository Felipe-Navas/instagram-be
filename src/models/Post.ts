import mongoose from 'mongoose';

import { Post } from '../types/types';

const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema<Post>({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  likes: [
    {
      type: ObjectId,
      ref: 'UserModel'
    }
  ],
  comments: [
    {
      commentText: String,
      commentedBy: { type: ObjectId, ref: 'UserModel' }
    }
  ],
  author: {
    type: ObjectId,
    ref: 'UserModel'
  }
});

export const PostModel = mongoose.model('PostModel', postSchema);
