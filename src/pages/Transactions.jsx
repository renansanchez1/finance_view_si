import { useState, useMemo } from 'react';
import { Plus, Download, FileText, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useApi } from '../hooks/useApi.js';
import { api } from '../api/client.js';
import { calcTotals, formatCurrency, getCategoryColor, formatDate, MONTHS } from '../utils/financialCalculations.js';
import FinanceCard from '../components/cards/FinanceCard.jsx';
import TransactionModal from '../components/modals/TransactionModal.jsx';
import { TrendingUp, TrendingDown, Wallet, Hash } from 'lucide-react';

export default function Transactions() {
  const [month, setMonth] = useState('2026-03');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [modal, setModal] = useState(null);

  const { data: txs = [], reload } = useApi(() => api.getTransactions({ month, type, category, search }), [month, type, category, search]);
  const { data: categories = [] } = useApi(() => api.getCategories(), []);

  const sorted = useMemo(() => [...txs].sort((a, b) => {
    const va = sortBy === 'date' ? a.date : a.amount;
    const vb = sortBy === 'date' ? b.date : b.amount;
    if (va < vb) return sortDir === 'asc' ? -1 : 1;
    if (va > vb) return sortDir === 'asc' ? 1 : -1;
    return 0;
  }), [txs, sortBy, sortDir]);

  const totals = useMemo(() => calcTotals(txs), [txs]);

  const toggleSort = (field) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortDir('desc'); }
  };

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return <ArrowUpDown size={12} opacity={0.4} />;
    return sortDir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />;
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Transações</h1>
          <p className="page-subtitle">{sorted.length} transações encontradas</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn" onClick={() => api.exportExcel(month)}><Download size={15} /> Excel</button>
          <button className="btn" onClick={() => api.exportCsv(month)}><FileText size={15} /> CSV</button>
          <button className="btn btn-primary" onClick={() => setModal('new')}><Plus size={15} /> Nova</button>
        </div>
      </div>

      <div className="cards-grid" style={{ marginBottom: 20 }}>
        <FinanceCard label="Receitas" value={totals.income} icon={TrendingUp} color="blue" animClass="anim-1" />
        <FinanceCard label="Despesas" value={totals.expense} icon={TrendingDown} color="red" animClass="anim-2" />
        <FinanceCard label="Saldo" value={totals.balance} icon={Wallet} color={totals.balance >= 0 ? 'green' : 'red'} animClass="anim-3" />
        <FinanceCard label="Qtd." value={sorted.length} icon={Hash} color="purple" animClass="anim-4" />
      </div>

      <div className="filter-bar">
        <div className="filter-group" style={{ maxWidth: 220 }}>
          <label className="filter-label">Buscar</label>
          <input className="filter-input" placeholder="Pesquisar..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="filter-group">
          <label className="filter-label">Mês</label>
          <select className="filter-select" value={month} onChange={e => setMonth(e.target.value)}>
            {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label className="filter-label">Tipo</label>
          <select className="filter-select" value={type} onChange={e => setType(e.target.value)}>
            <option value="">Todos</option>
            <option value="income">Receitas</option>
            <option value="expense">Despesas</option>
          </select>
        </div>
        <div className="filter-group">
          <label className="filter-label">Categoria</label>
          <select className="filter-select" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">Todas</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button className="btn" onClick={() => { setMonth(''); setType(''); setCategory(''); setSearch(''); }}>Limpar</button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {sorted.length === 0 ? (
          <div className="empty-state"><p>Nenhuma transação encontrada</p></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr>
                  {[['Descrição', null], ['Categoria', null], ['Tipo', null], ['Valor', 'amount'], ['Data', 'date'], ['', null]].map(([label, field]) => (
                    <th key={label} onClick={() => field && toggleSort(field)} style={{
                      padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700,
                      letterSpacing: '0.8px', textTransform: 'uppercase', color: 'var(--text-secondary)',
                      background: 'var(--bg)', borderBottom: '1px solid var(--border)',
                      cursor: field ? 'pointer' : 'default', whiteSpace: 'nowrap',
                    }}>
                      {field ? <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>{label} <SortIcon field={field} /></span> : label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map(tx => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                    onClick={() => setModal(tx)}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}>
                    <td style={{ padding: '13px 16px', fontWeight: 500 }}>
                      {tx.description}
                      {tx.recurring ? <span style={{ marginLeft: 6, fontSize: 10, background: 'var(--blue-dim)', color: 'var(--blue)', borderRadius: 4, padding: '2px 6px', fontWeight: 600 }}>↻ recorrente</span> : null}
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: getCategoryColor(tx.category), display: 'inline-block', flexShrink: 0 }} />
                        {tx.category}
                      </span>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span className={`badge ${tx.type}`}>{tx.type === 'income' ? '↑ Receita' : '↓ Despesa'}</span>
                    </td>
                    <td style={{ padding: '13px 16px' }} className={tx.type === 'income' ? 'amount-positive' : 'amount-negative'}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </td>
                    <td style={{ padding: '13px 16px', color: 'var(--text-secondary)', fontSize: 13 }}>{formatDate(tx.date)}</td>
                    <td style={{ padding: '13px 16px', color: 'var(--text-muted)', fontSize: 12 }}>Editar →</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <TransactionModal
          transaction={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); reload(); }}
          onDeleted={() => { setModal(null); reload(); }}
        />
      )}
    </div>
  );
}
