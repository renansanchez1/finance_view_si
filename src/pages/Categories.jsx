import { useMemo } from 'react';
import { useFilters } from '../hooks/useFilters.js';
import { groupByCategory, calcTotals, formatCurrency, getCategoryColor } from '../utils/financialCalculations.js';
import FilterBar from '../components/filters/FilterBar.jsx';
import CategoryChart from '../components/charts/CategoryChart.jsx';
import ExpenseBarChart from '../components/charts/ExpenseBarChart.jsx';
import FinanceCard from '../components/cards/FinanceCard.jsx';
import { Tag, TrendingDown, Hash, PieChart } from 'lucide-react';

export default function Categories() {
  const filters = useFilters();
  const { filtered } = filters;

  const byCat = useMemo(() => groupByCategory(filtered), [filtered]);
  const totalExp = useMemo(() => byCat.reduce((s, c) => s + c.value, 0), [byCat]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Categorias</h1>
          <p className="page-subtitle">Distribuição e análise por categoria</p>
        </div>
      </div>

      <FilterBar filters={filters} showSearch={false} />

      <div className="cards-grid" style={{ marginBottom: 24 }}>
        <FinanceCard label="Total Despesas" value={totalExp} icon={TrendingDown} color="red" animClass="anim-1" />
        <FinanceCard label="Categorias" value={byCat.length} icon={Tag} color="blue" animClass="anim-2" />
        <FinanceCard
          label="Maior Gasto"
          value={byCat[0]?.name || '—'}
          icon={PieChart}
          color="purple"
          meta={byCat[0] ? formatCurrency(byCat[0].value) : ''}
          animClass="anim-3"
        />
        <FinanceCard
          label="Média por Cat."
          value={byCat.length ? totalExp / byCat.length : 0}
          icon={Hash}
          color="green"
          animClass="anim-4"
        />
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

      {/* Category list */}
      <div className="card">
        <div className="section-title">Detalhamento por Categoria</div>
        {byCat.length === 0 && (
          <div className="empty-state"><p>Sem despesas neste período</p></div>
        )}
        {byCat.map((cat, i) => {
          const pct = totalExp > 0 ? (cat.value / totalExp) * 100 : 0;
          const color = getCategoryColor(cat.name);
          return (
            <div key={cat.name} className="cat-item" style={{ animationDelay: `${i * 0.05}s` }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: color + '22',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: color, display: 'block' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{cat.name}</span>
                  <span style={{ fontWeight: 600, fontSize: 14, color }}>
                    {formatCurrency(cat.value)}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="cat-bar-wrap">
                    <div
                      className="cat-bar"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', minWidth: 38, textAlign: 'right' }}>
                    {pct.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
