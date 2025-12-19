// server/routes/auth.js
import express from 'express';
import bcrypt from 'bcrypt';
import { findUserByEmail, createUser } from '../repositories/users.js';
import { generateToken } from '../utils/generateToken.js';

const router = express.Router();

// Sign up：新增 student 帳號
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  // 1. 檢查 email 格式（可簡單寫）、password 是否存在
  // 2. 檢查是否重複
  const existed = await findUserByEmail(email);
  if (existed) {
    return res.status(400).json({ error: 'Email 已被註冊' });
  }

  // 3. bcrypt.hash
  const passwordHash = await bcrypt.hash(password, 10);

  // 4. 建立 user（預設 role = 'student'）
  const user = await createUser({ email, passwordHash, role: 'student' });

  // 5. 簽發 JWT
  const token = generateToken(user);

  res.json({
    token,
    expiresIn: '2h',
    user: { id: user._id, email: user.email, role: user.role }
  });
});

// Login：驗證帳密 + 簽 token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(400).json({ error: '帳號或密碼錯誤' });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(400).json({ error: '帳號或密碼錯誤' });
  }

  const token = generateToken(user);

  res.json({
    token,
    expiresIn: '2h',
    user: { id: user._id, email: user.email, role: user.role }
  });
});

export default router;
