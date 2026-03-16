import { Router } from 'express';
import db from '../db/database.js';

const router = Router();

router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM profile WHERE id = 1').get());
});

router.put('/', (req, res) => {
  const { name, email, occupation, avatar, monthly_goal } = req.body;
  const p = db.prepare('SELECT * FROM profile WHERE id = 1').get();
  db.prepare('UPDATE profile SET name=?, email=?, occupation=?, avatar=?, monthly_goal=? WHERE id=1').run(
    name ?? p.name,
    email ?? p.email,
    occupation ?? p.occupation,
    avatar ?? p.avatar,
    monthly_goal != null ? Number(monthly_goal) : p.monthly_goal,
  );
  res.json(db.prepare('SELECT * FROM profile WHERE id = 1').get());
});

export default router;
