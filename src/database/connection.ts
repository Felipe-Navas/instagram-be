import mongoose from 'mongoose';

export const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION || '');
    console.log('DB connection successful');
  } catch (error) {
    console.error(error);
  }
};
