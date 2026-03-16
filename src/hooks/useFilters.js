import { useState, useMemo } from 'react';
import { transactions } from '../data/transactions.js';

export const useFilters = () => {
  const [month, setMonth] = useState('2026-03');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  const categories = useMemo(() => {
    const cats = [...new Set(transactions.map(t => t.category))].sort();
    return cats;
  }, []);

  const filtered = useMemo(() => {
    let txs = [...transactions];
    if (month) txs = txs.filter(t => t.date.startsWith(month));
    if (type) txs = txs.filter(t => t.type === type);
    if (category) txs = txs.filter(t => t.category === category);
    if (search) txs = txs.filter(t => t.description.toLowerCase().includes(search.toLowerCase()));

    txs.sort((a, b) => {
      let va = sortBy === 'date' ? a.date : a.amount;
      let vb = sortBy === 'date' ? b.date : b.amount;
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return txs;
  }, [month, type, category, search, sortBy, sortDir]);

  const toggleSort = (field) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortDir('desc'); }
  };

  return {
    month, setMonth,
    type, setType,
    category, setCategory,
    search, setSearch,
    sortBy, sortDir, toggleSort,
    filtered, categories,
  };
};
