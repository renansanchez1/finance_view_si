import { Router } from 'express';
import db from '../db/database.js';

const router = Router();

// GET all with filters
router.get('/', (req, res) => {
  const { month, type, category, search } = req.query;
  let sql = 'SELECT * FROM transactions WHERE 1=1';
  const params = [];

  if (month) { sql += ' AND date LIKE ?'; params.push(`${month}%`); }
  if (type) { sql += ' AND type = ?'; params.push(type); }
  if (category) { sql += ' AND category = ?'; params.push(category); }
  if (search) { sql += ' AND description LIKE ?'; params.push(`%${search}%`); }

  sql += ' ORDER BY date DESC, id DESC';
  res.json(db.prepare(sql).all(...params));
});

// GET single
router.get('/:id', (req, res) => {
  const tx = db.prepare('SELECT * FROM transactions WHERE id = ?').get(req.params.id);
  if (!tx) return res.status(404).json({ error: 'Not found' });
  res.json(tx);
});

// POST create
router.post('/', (req, res) => {
  const { description, amount, type, category, date, recurring = 0, notes = '' } = req.body;
  if (!description || !amount || !type || !category || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const result = db.prepare(`
    INSERT INTO transactions (description, amount, type, category, date, recurring, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(description, Number(amount), type, category, date, recurring ? 1 : 0, notes);

  const tx = db.prepare('SELECT * FROM transactions WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(tx);
});

// PUT update
router.put('/:id', (req, res) => {
  const { description, amount, type, category, date, recurring, notes } = req.body;
  const existing = db.prepare('SELECT * FROM transactions WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Not found' });

  db.prepare(`
    UPDATE transactions SET description=?, amount=?, type=?, category=?, date=?, recurring=?, notes=?
    WHERE id=?
  `).run(
    description ?? existing.description,
    amount != null ? Number(amount) : existing.amount,
    type ?? existing.type,
    category ?? existing.category,
    date ?? existing.date,
    recurring != null ? (recurring ? 1 : 0) : existing.recurring,
    notes ?? existing.notes,
    req.params.id
  );

  res.json(db.prepare('SELECT * FROM transactions WHERE id = ?').get(req.params.id));
});

// DELETE
router.delete('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM transactions WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  db.prepare('DELETE FROM transactions WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// GET categories list
router.get('/meta/categories', (req, res) => {
  const rows = db.prepare('SELECT DISTINCT category FROM transactions ORDER BY category').all();
  res.json(rows.map(r => r.category));
});

export default router;
