import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

export const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('DB connection established');
  } catch (error) {
    console.log('DB Error: ' + error);
  }
};

export const createJWT = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'none', //prevent CSRF attack
    maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
  });
};
