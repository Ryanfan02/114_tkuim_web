// routes/signup.js
import { Router } from 'express';
import { nanoid } from 'nanoid';

const router = Router();
const participants = [];

const requiredFields = ['name', 'email', 'phone', 'password', 'interests'];

function validatePayload(body) {
  for (const field of requiredFields) {
    if (!body[field]) {
      return `${field} 為必填`; 
    }
  }
  if (!/^09\d{8}$/.test(body.phone)) {
    return '手機需為 09 開頭 10 碼';
  }
  if (!Array.isArray(body.interests) || body.interests.length === 0) {
    return '至少選擇一個興趣';
  }
  if (body.password.length < 8) {
    return '密碼需至少 8 碼';
  }
  if (body.password !== body.confirmPassword) {
    return '密碼與確認密碼不一致';
  }
  return null;
}

router.get('/', (req, res) => {
  res.json({ total: participants.length, data: participants });
});

router.post('/', (req, res) => {
  const errorMessage = validatePayload(req.body || {});
  if (errorMessage) {
    return res.status(400).json({ error: errorMessage });
  }
  const newParticipant = {
    id: nanoid(8),
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    interests: req.body.interests,
    createdAt: new Date().toISOString()
  };
  participants.push(newParticipant);
  res.status(201).json({ message: '報名成功', participant: newParticipant });
});

router.delete('/:id', (req, res) => {
  const index = participants.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: '找不到這位參與者' });
  }
  const [removed] = participants.splice(index, 1);
  res.json({ message: '已取消報名', participant: removed });
});

export { router };
