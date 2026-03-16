import { Router } from 'express';
import * as XLSX from 'xlsx';
import db from '../db/database.js';

const router = Router();

const fmt = (n) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

// Export Excel
router.get('/excel', (req, res) => {
  const { month } = req.query;
  let sql = 'SELECT * FROM transactions';
  const params = [];
  if (month) { sql += ' WHERE date LIKE ?'; params.push(`${month}%`); }
  sql += ' ORDER BY date DESC';

  const txs = db.prepare(sql).all(...params);

  const data = txs.map(t => ({
    'Data': t.date,
    'Descrição': t.description,
    'Categoria': t.category,
    'Tipo': t.type === 'income' ? 'Receita' : 'Despesa',
    'Valor (R$)': t.amount,
    'Recorrente': t.recurring ? 'Sim' : 'Não',
    'Observações': t.notes || '',
  }));

  const income = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  data.push({}, {
    'Data': 'RESUMO',
    'Descrição': '',
    'Categoria': '',
    'Tipo': 'Receitas',
    'Valor (R$)': income,
  }, {
    'Data': '',
    'Descrição': '',
    'Categoria': '',
    'Tipo': 'Despesas',
    'Valor (R$)': expense,
  }, {
    'Data': '',
    'Descrição': '',
    'Categoria': '',
    'Tipo': 'Saldo',
    'Valor (R$)': income - expense,
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  ws['!cols'] = [{ wch: 12 }, { wch: 30 }, { wch: 18 }, { wch: 12 }, { wch: 15 }, { wch: 12 }, { wch: 25 }];
  XLSX.utils.book_append_sheet(wb, ws, 'Transações');

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  const filename = month ? `financeview-${month}.xlsx` : 'financeview-completo.xlsx';
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(buf);
});

// Export CSV
router.get('/csv', (req, res) => {
  const { month } = req.query;
  let sql = 'SELECT * FROM transactions';
  const params = [];
  if (month) { sql += ' WHERE date LIKE ?'; params.push(`${month}%`); }
  sql += ' ORDER BY date DESC';

  const txs = db.prepare(sql).all(...params);
  const header = 'Data,Descrição,Categoria,Tipo,Valor,Recorrente,Observações\n';
  const rows = txs.map(t =>
    `${t.date},"${t.description}",${t.category},${t.type === 'income' ? 'Receita' : 'Despesa'},${t.amount},${t.recurring ? 'Sim' : 'Não'},"${t.notes || ''}"`
  ).join('\n');

  res.setHeader('Content-Disposition', 'attachment; filename="financeview.csv"');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.send('\ufeff' + header + rows); // BOM for Excel UTF-8
});

export default router;
