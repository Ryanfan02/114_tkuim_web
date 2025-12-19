// server/app.js
import express from 'express';
import 'dotenv/config';
import { connectDB } from './db.js';
import authRouter from './routes/auth.js';
// 如果有 signupRouter 也一起 import
// import signupRouter from './routes/signup.js';

const app = express();
app.use(express.json());

// 先連線資料庫（ESM 可以用 top-level await）
await connectDB();

// 路由
app.use('/auth', authRouter);
// app.use('/api/signup', signupRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});

export default app;
