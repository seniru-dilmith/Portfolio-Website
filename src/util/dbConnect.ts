import mongoose from 'mongoose';

const MONGO_URI = process.env.NEXT_MONGO_URI;

if (!MONGO_URI) {
  throw new Error('❌ MONGO_URI is not defined in the environment variables.');
}

const cached = { conn: null as mongoose.Connection | null, promise: null as Promise<mongoose.Connection> | null };

const dbConnect = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then((connection) => {
      return connection.connection;
    });
  }

  cached.conn = await cached.promise;
  console.log('====================================');
  console.log('MongoDB connected');
  console.log('====================================');
  return cached.conn;
};

export default dbConnect;
