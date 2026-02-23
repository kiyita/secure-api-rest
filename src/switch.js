import { mockDb } from './mockDb.js';
import { mongooseDb } from './mongoose.db.js';

const provider = (process.env.DB_PROVIDER || 'mock').toLowerCase();

export const db = provider === 'mongoose' ? mongooseDb : mockDb;

export const dbProvider = provider;