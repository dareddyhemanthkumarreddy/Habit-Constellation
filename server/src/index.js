import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import habitsRoutes from './routes/habits.routes.js';
import checkinsRoutes from './routes/checkins.routes.js';
import insightsRoutes from './routes/insights.routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitsRoutes);
app.use('/api/checkins', checkinsRoutes);
app.use('/api/insights', insightsRoutes);

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Habit Constellation API' });
});

// Serve Client Static Build in Production
const clientDistPath = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(404).send('Static dist not built yet. Run client build first for single-service deployment.');
    }
  });
});

app.listen(PORT, () => {
  console.log(`✨ Habit Constellation server running on port ${PORT}`);
});
