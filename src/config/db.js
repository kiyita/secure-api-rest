import mongoose from 'mongoose';
import { dbProvider } from '../switch.js';

export const connectDB = async () => {
  if (dbProvider === 'mongoose') {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is required when DB_PROVIDER=mongoose');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ MongoDB connected');
    return;
  }

  console.log('✓ Mock database initialized (in-memory)');
};

