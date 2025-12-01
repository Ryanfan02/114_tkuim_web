// server/routes/signup.js
import express from 'express';
import {
  createParticipant,
  listParticipants,
  updateParticipant,
  deleteParticipant
} from '../repositories/participants.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ error: '缺少必要欄位' });
    }
    const id = await createParticipant({ name, email, phone });
   res.status(201).json({ _id: insertedId });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        error: '這個 email 已經報名過了，請使用其他 email'
      });
    }
    next(error);
  }
  
});

router.get('/', async (req, res, next) => {
  try {
    let page = parseInt(req.query.page, 10);
    let limit = parseInt(req.query.limit, 10);

    if (!Number.isFinite(page) || page < 1) page = 1;
    if (!Number.isFinite(limit) || limit < 1) limit = 10;

    const { items, total } = await listParticipants({ page, limit });

    res.json({
      items,
      total,
      page,
      limit
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const patch = {};
    
    if (typeof req.body.phone === 'string') {
      patch.phone = req.body.phone;
    }
    if (typeof req.body.status === 'string') {
      patch.status = req.body.status;
    }

    if (Object.keys(patch).length === 0) {
      return res.status(400).json({ error: '沒有可更新的欄位（僅允許 phone 或 status）' });
    }

    const result = await updateParticipant(req.params.id, patch);

    if (!result.matchedCount) {
      return res.status(404).json({ error: '找不到資料' });
    }

    res.json({ updated: result.modifiedCount });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const result = await deleteParticipant(req.params.id);
    if (!result.deletedCount) {
      return res.status(404).json({ error: '找不到資料' });
    }
    res.status(204).end();
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        error: '這個 email 已經報名過了，請使用其他 email'
      });
    }
    next(error);
  }
});

export default router;
