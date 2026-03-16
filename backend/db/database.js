import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');
mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(join(DATA_DIR, 'financeview.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    amount REAL NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('income','expense')),
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    recurring INTEGER DEFAULT 0,
    notes TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS budgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL UNIQUE,
    monthly_limit REAL NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    target_amount REAL NOT NULL,
    current_amount REAL NOT NULL DEFAULT 0,
    deadline TEXT,
    color TEXT DEFAULT '#00d084',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY DEFAULT 1,
    name TEXT DEFAULT 'Usuário',
    email TEXT DEFAULT '',
    occupation TEXT DEFAULT '',
    avatar TEXT DEFAULT 'US',
    monthly_goal REAL DEFAULT 2000,
    join_date TEXT DEFAULT (date('now'))
  );
`);

// Seed only if empty
const count = db.prepare('SELECT COUNT(*) as c FROM transactions').get();
if (count.c === 0) {
  const insert = db.prepare(`
    INSERT INTO transactions (description, amount, type, category, date, recurring)
    VALUES (@description, @amount, @type, @category, @date, @recurring)
  `);

  const seed = db.transaction((rows) => rows.forEach(r => insert.run(r)));
  seed([
    // Janeiro
    { description: 'Salário', amount: 6500, type: 'income', category: 'Salário', date: '2026-01-01', recurring: 1 },
    { description: 'Freelance Design', amount: 1200, type: 'income', category: 'Freelance', date: '2026-01-10', recurring: 0 },
    { description: 'Aluguel', amount: 1800, type: 'expense', category: 'Moradia', date: '2026-01-05', recurring: 1 },
    { description: 'Supermercado', amount: 480, type: 'expense', category: 'Alimentação', date: '2026-01-08', recurring: 0 },
    { description: 'Uber', amount: 95, type: 'expense', category: 'Transporte', date: '2026-01-12', recurring: 0 },
    { description: 'Netflix', amount: 39.90, type: 'expense', category: 'Lazer', date: '2026-01-15', recurring: 1 },
    { description: 'Gym', amount: 120, type: 'expense', category: 'Saúde', date: '2026-01-03', recurring: 1 },
    { description: 'Restaurante', amount: 210, type: 'expense', category: 'Alimentação', date: '2026-01-20', recurring: 0 },
    { description: 'Conta de Luz', amount: 185, type: 'expense', category: 'Moradia', date: '2026-01-18', recurring: 1 },
    { description: 'Tesouro Direto', amount: 500, type: 'expense', category: 'Investimentos', date: '2026-01-25', recurring: 1 },
    // Fevereiro
    { description: 'Salário', amount: 6500, type: 'income', category: 'Salário', date: '2026-02-01', recurring: 1 },
    { description: 'Dividendos', amount: 340, type: 'income', category: 'Investimentos', date: '2026-02-14', recurring: 0 },
    { description: 'Aluguel', amount: 1800, type: 'expense', category: 'Moradia', date: '2026-02-05', recurring: 1 },
    { description: 'Supermercado', amount: 520, type: 'expense', category: 'Alimentação', date: '2026-02-07', recurring: 0 },
    { description: 'Supermercado Extra', amount: 140, type: 'expense', category: 'Alimentação', date: '2026-02-21', recurring: 0 },
    { description: 'Combustível', amount: 230, type: 'expense', category: 'Transporte', date: '2026-02-10', recurring: 0 },
    { description: 'Cinema', amount: 65, type: 'expense', category: 'Lazer', date: '2026-02-13', recurring: 0 },
    { description: 'Farmácia', amount: 89, type: 'expense', category: 'Saúde', date: '2026-02-16', recurring: 0 },
    { description: 'Conta de Água', amount: 75, type: 'expense', category: 'Moradia', date: '2026-02-20', recurring: 1 },
    { description: 'Ações PETR4', amount: 800, type: 'expense', category: 'Investimentos', date: '2026-02-25', recurring: 0 },
    { description: 'Spotify', amount: 21.90, type: 'expense', category: 'Lazer', date: '2026-02-18', recurring: 1 },
    // Março
    { description: 'Salário', amount: 6500, type: 'income', category: 'Salário', date: '2026-03-01', recurring: 1 },
    { description: 'Freelance Dev', amount: 2400, type: 'income', category: 'Freelance', date: '2026-03-08', recurring: 0 },
    { description: 'Aluguel', amount: 1800, type: 'expense', category: 'Moradia', date: '2026-03-05', recurring: 1 },
    { description: 'Supermercado', amount: 390, type: 'expense', category: 'Alimentação', date: '2026-03-06', recurring: 0 },
    { description: 'iFood', amount: 145, type: 'expense', category: 'Alimentação', date: '2026-03-11', recurring: 0 },
    { description: 'Metrô Mensal', amount: 180, type: 'expense', category: 'Transporte', date: '2026-03-03', recurring: 1 },
    { description: 'Show Ingresso', amount: 280, type: 'expense', category: 'Lazer', date: '2026-03-14', recurring: 0 },
    { description: 'Consulta Médica', amount: 250, type: 'expense', category: 'Saúde', date: '2026-03-09', recurring: 0 },
    { description: 'Conta de Luz', amount: 195, type: 'expense', category: 'Moradia', date: '2026-03-12', recurring: 1 },
    { description: 'Tesouro Direto', amount: 1000, type: 'expense', category: 'Investimentos', date: '2026-03-10', recurring: 1 },
    { description: 'Netflix', amount: 39.90, type: 'expense', category: 'Lazer', date: '2026-03-15', recurring: 1 },
  ]);

  // Seed budgets
  const insertBudget = db.prepare('INSERT OR IGNORE INTO budgets (category, monthly_limit) VALUES (?, ?)');
  [
    ['Alimentação', 800], ['Moradia', 2200], ['Transporte', 300],
    ['Lazer', 400], ['Saúde', 400], ['Investimentos', 1500],
  ].forEach(([c, l]) => insertBudget.run(c, l));

  // Seed goals
  db.prepare(`INSERT INTO goals (name, target_amount, current_amount, deadline, color) VALUES (?,?,?,?,?)`).run('Reserva de Emergência', 20000, 14320, '2026-12-31', '#00d084');
  db.prepare(`INSERT INTO goals (name, target_amount, current_amount, deadline, color) VALUES (?,?,?,?,?)`).run('Viagem Europa', 8000, 2400, '2027-06-01', '#3b82f6');
  db.prepare(`INSERT INTO goals (name, target_amount, current_amount, deadline, color) VALUES (?,?,?,?,?)`).run('Notebook Novo', 5000, 1800, '2026-08-01', '#8b5cf6');

  // Seed profile
  db.prepare(`INSERT OR IGNORE INTO profile (id, name, email, occupation, avatar, monthly_goal) VALUES (1,?,?,?,?,?)`).run('Ana Paula', 'anapaula@email.com', 'Desenvolvedora Full Stack', 'AP', 2000);
}

export default db;
