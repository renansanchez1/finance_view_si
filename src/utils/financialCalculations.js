import { format, parseISO, getMonth, getYear } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export const formatDate = (dateStr) =>
  format(parseISO(dateStr), 'dd/MM/yyyy');

export const getMonthName = (dateStr) =>
  format(parseISO(dateStr), 'MMM', { locale: ptBR });

export const calcTotals = (txs) => {
  const income = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  return { income, expense, balance: income - expense };
};

export const groupByCategory = (txs) => {
  const map = {};
  txs.filter(t => t.type === 'expense').forEach(t => {
    map[t.category] = (map[t.category] || 0) + t.amount;
  });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

export const groupByMonth = (txs) => {
  const map = {};
  txs.forEach(t => {
    const key = t.date.slice(0, 7);
    if (!map[key]) map[key] = { month: key, income: 0, expense: 0 };
    if (t.type === 'income') map[key].income += t.amount;
    else map[key].expense += t.amount;
  });
  return Object.values(map)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map(m => ({
      ...m,
      label: format(parseISO(m.month + '-01'), 'MMM yy', { locale: ptBR }),
    }));
};

export const getInsights = (txs) => {
  const expenses = txs.filter(t => t.type === 'expense');
  const totalExp = expenses.reduce((s, t) => s + t.amount, 0);
  const byCat = groupByCategory(txs);
  const insights = [];

  if (byCat.length > 0) {
    const top = byCat[0];
    const pct = ((top.value / totalExp) * 100).toFixed(0);
    insights.push({ type: 'warning', text: `${top.name} representa ${pct}% das suas despesas.` });
  }

  const { income, expense } = calcTotals(txs);
  if (income > 0) {
    const savePct = (((income - expense) / income) * 100).toFixed(0);
    if (savePct > 20) insights.push({ type: 'success', text: `Ótimo! Você poupou ${savePct}% da renda este mês.` });
    else if (savePct > 0) insights.push({ type: 'info', text: `Você poupou ${savePct}% da renda. Meta: 20%.` });
    else insights.push({ type: 'danger', text: `Suas despesas superaram a renda este período.` });
  }

  return insights;
};

export const CATEGORY_COLORS = {
  'Alimentação': '#f59e0b',
  'Moradia': '#6366f1',
  'Transporte': '#10b981',
  'Lazer': '#ec4899',
  'Saúde': '#14b8a6',
  'Investimentos': '#8b5cf6',
  'Salário': '#22c55e',
  'Freelance': '#3b82f6',
  'default': '#94a3b8',
};

export const getCategoryColor = (cat) => CATEGORY_COLORS[cat] || CATEGORY_COLORS.default;

export const MONTHS = [
  { value: '', label: 'Todos os meses' },
  { value: '2026-01', label: 'Janeiro 2026' },
  { value: '2026-02', label: 'Fevereiro 2026' },
  { value: '2026-03', label: 'Março 2026' },
];
