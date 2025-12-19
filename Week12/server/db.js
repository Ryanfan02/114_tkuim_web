// server/db.js
import { MongoClient } from 'mongodb';
import 'dotenv/config';

const uri = process.env.MONGO_URL;
if (!uri) {
  throw new Error('請在 .env 設定 MONGO_URL');
}

const client = new MongoClient(uri);
let db = null;

export async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db('week12');   // 這裡名稱也要跟老師的一樣
    console.log('MongoDB connected: week12');
  }
  return db;
}

export function getCollection(name) {
  if (!db) {
    throw new Error('DB 尚未連線，請先在 app.js 呼叫 connectDB()');
  }
  return db.collection(name);
}
