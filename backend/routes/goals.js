import { Router } from 'express';
import db from '../db/database.js';

const router = Router();

router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM goals ORDER BY created_at').all());
});

router.post('/', (req, res) => {
  const { name, target_amount, current_amount = 0, deadline, color = '#00d084' } = req.body;
  if (!name || !target_amount) return res.status(400).json({ error: 'Missing fields' });
  const r = db.prepare('INSERT INTO goals (name, target_amount, current_amount, deadline, color) VALUES (?,?,?,?,?)').run(name, Number(target_amount), Number(current_amount), deadline || null, color);
  res.status(201).json(db.prepare('SELECT * FROM goals WHERE id = ?').get(r.lastInsertRowid));
});

router.put('/:id', (req, res) => {
  const { name, target_amount, current_amount, deadline, color } = req.body;
  const g = db.prepare('SELECT * FROM goals WHERE id = ?').get(req.params.id);
  if (!g) return res.status(404).json({ error: 'Not found' });
  db.prepare('UPDATE goals SET name=?, target_amount=?, current_amount=?, deadline=?, color=? WHERE id=?').run(
    name ?? g.name,
    target_amount != null ? Number(target_amount) : g.target_amount,
    current_amount != null ? Number(current_amount) : g.current_amount,
    deadline ?? g.deadline,
    color ?? g.color,
    req.params.id
  );
  res.json(db.prepare('SELECT * FROM goals WHERE id = ?').get(req.params.id));
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM goals WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

export default router;
