import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

export interface User {
  fullName: string;
  email: string;
  password: string;
  profilePicUrl?: string;
  followers: (typeof mongoose.Schema.Types.ObjectId)[];
  following: (typeof mongoose.Schema.Types.ObjectId)[];
}

const userSchema = new mongoose.Schema<User>({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicUrl: {
    type: String,
    default:
      'https://res.cloudinary.com/instagramcloneapp/image/upload/v1633881327/picture-not-available_wb3gtb.jpg'
  },
  followers: [{ type: ObjectId, ref: 'UserModel' }],
  following: [{ type: ObjectId, ref: 'UserModel' }]
});

mongoose.model('UserModel', userSchema);
