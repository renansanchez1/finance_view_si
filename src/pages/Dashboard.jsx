import { useMemo } from 'react';
import { Wallet, TrendingUp, TrendingDown, Calendar, Lightbulb, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';
import { transactions } from '../data/transactions.js';
import { calcTotals, groupByCategory, groupByMonth, getInsights, formatCurrency } from '../utils/financialCalculations.js';
import FinanceCard from '../components/cards/FinanceCard.jsx';
import CategoryChart from '../components/charts/CategoryChart.jsx';
import MonthlyChart from '../components/charts/MonthlyChart.jsx';
import FilterBar from '../components/filters/FilterBar.jsx';
import { useFilters } from '../hooks/useFilters.js';

const InsightIcon = ({ type }) => {
  const props = { size: 16 };
  if (type === 'success') return <CheckCircle {...props} color="var(--accent)" />;
  if (type === 'warning') return <AlertTriangle {...props} color="var(--yellow)" />;
  if (type === 'danger') return <AlertCircle {...props} color="var(--red)" />;
  return <Info {...props} color="var(--blue)" />;
};

export default function Dashboard() {
  const filters = useFilters();
  const { filtered } = filters;

  const totals = useMemo(() => calcTotals(filtered), [filtered]);
  const byCat = useMemo(() => groupByCategory(filtered), [filtered]);
  const byMonth = useMemo(() => groupByMonth(transactions), []);
  const insights = useMemo(() => getInsights(filtered), [filtered]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Visão geral das suas finanças</p>
        </div>
      </div>

      <FilterBar filters={filters} showSearch={false} />

      <div className="cards-grid">
        <FinanceCard
          label="Saldo Atual"
          value={totals.balance}
          icon={Wallet}
          color={totals.balance >= 0 ? 'green' : 'red'}
          meta="Receitas menos despesas"
          animClass="anim-1"
        />
        <FinanceCard
          label="Receitas"
          value={totals.income}
          icon={TrendingUp}
          color="blue"
          meta={`${filtered.filter(t => t.type === 'income').length} transações`}
          animClass="anim-2"
        />
        <FinanceCard
          label="Despesas"
          value={totals.expense}
          icon={TrendingDown}
          color="red"
          meta={`${filtered.filter(t => t.type === 'expense').length} transações`}
          animClass="anim-3"
        />
        <FinanceCard
          label="Transações"
          value={filtered.length}
          icon={Calendar}
          color="purple"
          meta="no período selecionado"
          animClass="anim-4"
        />
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Lightbulb size={17} color="var(--yellow)" />
            Insights
          </div>
          {insights.map((ins, i) => (
            <div key={i} className={`insight-card ${ins.type}`}>
              <InsightIcon type={ins.type} />
              <span>{ins.text}</span>
            </div>
          ))}
        </div>
      )}

      <div className="two-col">
        <div className="card">
          <div className="section-title">Gastos por Categoria</div>
          <CategoryChart data={byCat} />
        </div>
        <div className="card">
          <div className="section-title">Evolução Mensal</div>
          <MonthlyChart data={byMonth} />
        </div>
      </div>

      {/* Top expenses */}
      <div className="card">
        <div className="section-title">Últimas Transações</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr>
                {['Descrição', 'Categoria', 'Tipo', 'Valor', 'Data'].map(h => (
                  <th key={h} style={{
                    padding: '10px 14px',
                    textAlign: 'left',
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.8px',
                    textTransform: 'uppercase',
                    color: 'var(--text-secondary)',
                    borderBottom: '1px solid var(--border)',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 5).map(tx => (
                <tr key={tx.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 500 }}>{tx.description}</td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>{tx.category}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span className={`badge ${tx.type}`}>
                      {tx.type === 'income' ? '↑ Receita' : '↓ Despesa'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px' }} className={tx.type === 'income' ? 'amount-positive' : 'amount-negative'}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', fontSize: 13 }}>
                    {new Date(tx.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
