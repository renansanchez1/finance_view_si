import { useMemo, useState } from 'react';
import { useApi } from '../hooks/useApi.js';
import { api } from '../api/client.js';
import { groupByCategory, calcTotals, formatCurrency, getCategoryColor, MONTHS } from '../utils/financialCalculations.js';
import CategoryChart from '../components/charts/CategoryChart.jsx';
import ExpenseBarChart from '../components/charts/ExpenseBarChart.jsx';
import CompareChart from '../components/charts/CompareChart.jsx';
import FinanceCard from '../components/cards/FinanceCard.jsx';
import { Tag, TrendingDown, Hash, PieChart } from 'lucide-react';

export default function Categories() {
  const [month, setMonth] = useState('2026-03');
  const [compareMonth, setCompareMonth] = useState('2026-02');

  const { data: txs = [] } = useApi(() => api.getTransactions({ month }), [month]);
  const { data: compareData = [] } = useApi(() => api.getCompare(month, compareMonth), [month, compareMonth]);

  const byCat = useMemo(() => groupByCategory(txs), [txs]);
  const totalExp = byCat.reduce((s, c) => s + c.value, 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Categorias</h1>
          <p className="page-subtitle">Distribuição e análise por categoria</p>
        </div>
        <select className="filter-select" value={month} onChange={e => setMonth(e.target.value)}>
          {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
      </div>

      <div className="cards-grid" style={{ marginBottom: 24 }}>
        <FinanceCard label="Total Despesas" value={totalExp} icon={TrendingDown} color="red" animClass="anim-1" />
        <FinanceCard label="Categorias" value={byCat.length} icon={Tag} color="blue" animClass="anim-2" />
        <FinanceCard label="Maior Gasto" value={byCat[0]?.name || '—'} icon={PieChart} color="purple" meta={byCat[0] ? formatCurrency(byCat[0].value) : ''} animClass="anim-3" />
        <FinanceCard label="Média por Cat." value={byCat.length ? totalExp / byCat.length : 0} icon={Hash} color="green" animClass="anim-4" />
      </div>

      <div className="two-col" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="section-title">Distribuição por Categoria</div>
          <CategoryChart data={byCat} />
        </div>
        <div className="card">
          <div className="section-title">Comparativo de Gastos</div>
          <ExpenseBarChart data={byCat} />
        </div>
      </div>

      {/* Month comparison */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div className="section-title" style={{ margin: 0 }}>Comparativo Mês a Mês</div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <select className="filter-select" value={month} onChange={e => setMonth(e.target.value)}>
              {MONTHS.filter(m => m.value).map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>vs</span>
            <select className="filter-select" value={compareMonth} onChange={e => setCompareMonth(e.target.value)}>
              {MONTHS.filter(m => m.value).map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
        </div>
        <CompareChart data={compareData} month1={month} month2={compareMonth} />
      </div>

      {/* Category list */}
      <div className="card">
        <div className="section-title">Detalhamento por Categoria</div>
        {byCat.length === 0 ? (
          <div className="empty-state"><p>Sem despesas neste período</p></div>
        ) : byCat.map((cat, i) => {
          const pct = totalExp > 0 ? (cat.value / totalExp) * 100 : 0;
          const color = getCategoryColor(cat.name);
          return (
            <div key={cat.name} className="cat-item">
              <div style={{ width: 38, height: 38, borderRadius: 10, background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: color, display: 'block' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{cat.name}</span>
                  <span style={{ fontWeight: 600, fontSize: 14, color }}>{formatCurrency(cat.value)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="cat-bar-wrap">
                    <div className="cat-bar" style={{ width: `${pct}%`, background: color }} />
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', minWidth: 38, textAlign: 'right' }}>{pct.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
