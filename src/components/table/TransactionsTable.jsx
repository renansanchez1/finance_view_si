import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { formatCurrency, formatDate, getCategoryColor } from '../../utils/financialCalculations.js';

export default function TransactionsTable({ transactions, sortBy, sortDir, toggleSort }) {
  if (transactions.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <ArrowUpDown size={48} strokeWidth={1} />
        </div>
        <p>Nenhuma transação encontrada</p>
      </div>
    );
  }

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return <ArrowUpDown size={13} opacity={0.4} />;
    return sortDir === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />;
  };

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Categoria</th>
            <th>Tipo</th>
            <th className="sortable" onClick={() => toggleSort('amount')}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                Valor <SortIcon field="amount" />
              </span>
            </th>
            <th className="sortable" onClick={() => toggleSort('date')}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                Data <SortIcon field="date" />
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx.id}>
              <td style={{ fontWeight: 500 }}>{tx.description}</td>
              <td>
                <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span
                    className="category-dot"
                    style={{ background: getCategoryColor(tx.category) }}
                  />
                  {tx.category}
                </span>
              </td>
              <td>
                <span className={`badge ${tx.type}`}>
                  {tx.type === 'income' ? '↑ Receita' : '↓ Despesa'}
                </span>
              </td>
              <td className={tx.type === 'income' ? 'amount-positive' : 'amount-negative'}>
                {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
              </td>
              <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                {formatDate(tx.date)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
