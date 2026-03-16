import { Router } from 'express';
import db from '../db/database.js';

const router = Router();

router.get('/', (req, res) => {
  const { month } = req.query;
  const budgets = db.prepare('SELECT * FROM budgets ORDER BY category').all();

  if (month) {
    const spent = db.prepare(`
      SELECT category, SUM(amount) as spent
      FROM transactions
      WHERE type = 'expense' AND date LIKE ?
      GROUP BY category
    `).all(`${month}%`);

    const spentMap = Object.fromEntries(spent.map(s => [s.category, s.spent]));
    const result = budgets.map(b => ({
      ...b,
      spent: spentMap[b.category] || 0,
      remaining: b.monthly_limit - (spentMap[b.category] || 0),
      pct: Math.min(100, ((spentMap[b.category] || 0) / b.monthly_limit) * 100),
    }));
    return res.json(result);
  }

  res.json(budgets);
});

router.post('/', (req, res) => {
  const { category, monthly_limit } = req.body;
  if (!category || !monthly_limit) return res.status(400).json({ error: 'Missing fields' });

  db.prepare('INSERT OR REPLACE INTO budgets (category, monthly_limit) VALUES (?, ?)').run(category, Number(monthly_limit));
  res.status(201).json(db.prepare('SELECT * FROM budgets WHERE category = ?').get(category));
});

router.put('/:id', (req, res) => {
  const { monthly_limit } = req.body;
  db.prepare('UPDATE budgets SET monthly_limit = ? WHERE id = ?').run(Number(monthly_limit), req.params.id);
  res.json(db.prepare('SELECT * FROM budgets WHERE id = ?').get(req.params.id));
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM budgets WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

export default router;
