// server/repositories/users.js
import { getCollection } from '../db.js';

// 用 email 找一個使用者
export async function findUserByEmail(email) {
  return getCollection('users').findOne({ email });
}

// 建立使用者，預設 role = 'student'
export async function createUser({ email, passwordHash, role = 'student' }) {
  const doc = {
    email,
    passwordHash,
    role,
    createdAt: new Date()
  };

  const result = await getCollection('users').insertOne(doc);
  // 回傳包含 _id 的完整 user 物件，給 auth.js 產生 token 用
  return { ...doc, _id: result.insertedId };
}
