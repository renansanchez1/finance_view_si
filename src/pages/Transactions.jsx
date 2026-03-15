import { useMemo } from 'react';
import { useFilters } from '../hooks/useFilters.js';
import { calcTotals, formatCurrency } from '../utils/financialCalculations.js';
import FilterBar from '../components/filters/FilterBar.jsx';
import TransactionsTable from '../components/table/TransactionsTable.jsx';
import FinanceCard from '../components/cards/FinanceCard.jsx';
import { TrendingUp, TrendingDown, Wallet, Hash } from 'lucide-react';

export default function Transactions() {
  const filters = useFilters();
  const { filtered, sortBy, sortDir, toggleSort } = filters;
  const totals = useMemo(() => calcTotals(filtered), [filtered]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Transações</h1>
          <p className="page-subtitle">{filtered.length} transações encontradas</p>
        </div>
      </div>

      <div className="cards-grid" style={{ marginBottom: 20 }}>
        <FinanceCard label="Receitas" value={totals.income} icon={TrendingUp} color="blue" animClass="anim-1" />
        <FinanceCard label="Despesas" value={totals.expense} icon={TrendingDown} color="red" animClass="anim-2" />
        <FinanceCard label="Saldo" value={totals.balance} icon={Wallet} color={totals.balance >= 0 ? 'green' : 'red'} animClass="anim-3" />
        <FinanceCard label="Qtd." value={filtered.length} icon={Hash} color="purple" animClass="anim-4" />
      </div>

      <FilterBar filters={filters} showSearch={true} />

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <TransactionsTable
          transactions={filtered}
          sortBy={sortBy}
          sortDir={sortDir}
          toggleSort={toggleSort}
        />
      </div>
    </div>
  );
}
