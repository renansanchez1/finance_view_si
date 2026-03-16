import express from 'express';
import cors from 'cors';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

import transactionsRouter from './routes/transactions.js';
import budgetsRouter from './routes/budgets.js';
import goalsRouter from './routes/goals.js';
import analyticsRouter from './routes/analytics.js';
import exportRouter from './routes/export.js';
import profileRouter from './routes/profile.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);
const IS_PROD = process.env.NODE_ENV === 'production';

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/transactions', transactionsRouter);
app.use('/api/budgets', budgetsRouter);
app.use('/api/goals', goalsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/export', exportRouter);
app.use('/api/profile', profileRouter);

app.get('/api/health', (req, res) => res.json({ status: 'ok', version: '2.0.0' }));

// In production, serve Vite build
if (IS_PROD) {
  const DIST = join(__dirname, '..', 'dist');
  if (existsSync(DIST)) {
    app.use(express.static(DIST));
    app.get('*', (req, res) => {
      res.sendFile(join(DIST, 'index.html'));
    });
  }
}

app.listen(IS_PROD ? PORT : PORT, '0.0.0.0', () => {
  console.log(`✅ FinanceView API running on http://0.0.0.0:${PORT}`);
  if (IS_PROD) console.log(`🌐 Serving frontend from /dist`);
});
