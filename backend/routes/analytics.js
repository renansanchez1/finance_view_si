import { Router } from 'express';
import db from '../db/database.js';

const router = Router();

// Monthly summary grouped
router.get('/monthly', (req, res) => {
  const rows = db.prepare(`
    SELECT
      strftime('%Y-%m', date) as month,
      SUM(CASE WHEN type='income' THEN amount ELSE 0 END) as income,
      SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as expense
    FROM transactions
    GROUP BY month
    ORDER BY month
  `).all();
  res.json(rows);
});

// Month vs month comparison
router.get('/compare', (req, res) => {
  const { month1, month2 } = req.query;
  if (!month1 || !month2) return res.status(400).json({ error: 'month1 and month2 required' });

  const summary = (m) => db.prepare(`
    SELECT
      category,
      SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as expense,
      SUM(CASE WHEN type='income' THEN amount ELSE 0 END) as income
    FROM transactions WHERE date LIKE ? GROUP BY category
  `).all(`${m}%`);

  const s1 = summary(month1);
  const s2 = summary(month2);

  const categories = [...new Set([...s1.map(r => r.category), ...s2.map(r => r.category)])];
  const result = categories.map(cat => ({
    category: cat,
    [month1]: s1.find(r => r.category === cat)?.expense || 0,
    [month2]: s2.find(r => r.category === cat)?.expense || 0,
  }));

  res.json(result);
});

// Heatmap: total expense per day of month
router.get('/heatmap', (req, res) => {
  const { month } = req.query;
  const where = month ? `AND date LIKE '${month}%'` : '';
  const rows = db.prepare(`
    SELECT date, SUM(amount) as total
    FROM transactions
    WHERE type='expense' ${where}
    GROUP BY date
    ORDER BY date
  `).all();
  res.json(rows);
});

// 6-month projection based on avg of last 3 months
router.get('/projection', (req, res) => {
  const history = db.prepare(`
    SELECT
      strftime('%Y-%m', date) as month,
      SUM(CASE WHEN type='income' THEN amount ELSE 0 END) as income,
      SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as expense
    FROM transactions
    GROUP BY month
    ORDER BY month DESC
    LIMIT 3
  `).all();

  if (!history.length) return res.json([]);

  const avgIncome = history.reduce((s, r) => s + r.income, 0) / history.length;
  const avgExpense = history.reduce((s, r) => s + r.expense, 0) / history.length;

  const lastMonth = history[0].month;
  const [yr, mo] = lastMonth.split('-').map(Number);

  const projected = [];
  for (let i = 1; i <= 6; i++) {
    const d = new Date(yr, mo - 1 + i, 1);
    const label = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    projected.push({
      month: label,
      income: Math.round(avgIncome),
      expense: Math.round(avgExpense),
      projected: true,
    });
  }

  res.json([...history.reverse(), ...projected]);
});

// Notifications: budget alerts
router.get('/alerts', (req, res) => {
  const month = req.query.month || new Date().toISOString().slice(0, 7);
  const budgets = db.prepare('SELECT * FROM budgets').all();
  const spent = db.prepare(`
    SELECT category, SUM(amount) as spent
    FROM transactions WHERE type='expense' AND date LIKE ?
    GROUP BY category
  `).all(`${month}%`);

  const spentMap = Object.fromEntries(spent.map(s => [s.category, s.spent]));
  const alerts = [];

  budgets.forEach(b => {
    const s = spentMap[b.category] || 0;
    const pct = (s / b.monthly_limit) * 100;
    if (pct >= 100) {
      alerts.push({ type: 'danger', category: b.category, pct: Math.round(pct), spent: s, limit: b.monthly_limit, message: `Limite de ${b.category} ultrapassado! (${Math.round(pct)}%)` });
    } else if (pct >= 80) {
      alerts.push({ type: 'warning', category: b.category, pct: Math.round(pct), spent: s, limit: b.monthly_limit, message: `${b.category} em ${Math.round(pct)}% do limite mensal.` });
    }
  });

  res.json(alerts);
});

export default router;
