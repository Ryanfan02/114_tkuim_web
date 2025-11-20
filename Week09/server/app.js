// Week09/server/app.js
import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { router as signupRouter } from './routes/signup.js';

config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.ALLOWED_ORIGIN?.split(',') ?? '*' }));
app.use(express.json());
app.use('/api/signup', signupRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((error, req, res, next) => {
  console.error('[Server Error]', error.message);
  res.status(500).json({ error: 'Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server ready on http://localhost:${PORT}`);
});
