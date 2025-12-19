// server/routes/signup.js
import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  findAll,             // admin 用
  findByOwner,         // 依 ownerId 查
  createParticipant,   // 新增
  deleteById           // 刪除
} from '../repositories/participants.js';

const router = express.Router();

// 所有 /api/signup 底下都要先登入
router.use(authMiddleware);

// GET /api/signup
router.get('/', async (req, res) => {
  const isAdmin = req.user.role === 'admin';
  const data = isAdmin
    ? await findAll()
    : await findByOwner(req.user.id);

  res.json({
    total: data.length,
    data: data.map(/* serializeParticipant */ p => p)
  });
});

// POST /api/signup
router.post('/', async (req, res) => {
  const payload = req.body;
  // 建立資料時帶上 ownerId
  const doc = await createParticipant({
    ...payload,
    ownerId: req.user.id
  });
  res.status(201).json(doc);
});

// DELETE /api/signup/:id
router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  const doc = await findById(id);  // 需要在 participants repository 補這個
  if (!doc) {
    return res.status(404).json({ error: '找不到資料' });
  }

  const isOwner = doc.ownerId?.toString() === req.user.id;
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ error: '權限不足' });
  }

  await deleteById(id);
  res.json({ message: '刪除完成' });
});

export default router;
