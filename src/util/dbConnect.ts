import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('❌ MONGO_URI is not defined in the environment variables.');
}

declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const dbConnect = async () => {

  if (mongoose.connections[0].readyState) {
    return true;
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log('====================================');
    console.log('MongoDB connected');
    console.log('====================================');
    return true;
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    return false;
  }
};

export default dbConnect;
