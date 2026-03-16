import { useState, useMemo } from 'react';
import { Wallet, TrendingUp, TrendingDown, Calendar, Lightbulb, AlertTriangle, CheckCircle, Info, AlertCircle, Plus, Download } from 'lucide-react';
import { useApi } from '../hooks/useApi.js';
import { api } from '../api/client.js';
import { calcTotals, groupByCategory, getInsights, formatCurrency, MONTHS } from '../utils/financialCalculations.js';
import FinanceCard from '../components/cards/FinanceCard.jsx';
import CategoryChart from '../components/charts/CategoryChart.jsx';
import HeatmapChart from '../components/charts/HeatmapChart.jsx';
import ProjectionChart from '../components/charts/ProjectionChart.jsx';
import NotificationBell from '../components/notifications/NotificationBell.jsx';
import TransactionModal from '../components/modals/TransactionModal.jsx';

const InsightIcon = ({ type }) => {
  const props = { size: 16 };
  if (type === 'success') return <CheckCircle {...props} color="var(--accent)" />;
  if (type === 'warning') return <AlertTriangle {...props} color="var(--yellow)" />;
  if (type === 'danger') return <AlertCircle {...props} color="var(--red)" />;
  return <Info {...props} color="var(--blue)" />;
};

export default function Dashboard() {
  const [month, setMonth] = useState('2026-03');
  const [showModal, setShowModal] = useState(false);

  const { data: txs = [], reload } = useApi(() => api.getTransactions({ month }), [month]);
  const { data: heatmap = [] } = useApi(() => api.getHeatmap(month), [month]);
  const { data: projection = [] } = useApi(() => api.getProjection(), []);

  const totals = useMemo(() => calcTotals(txs), [txs]);
  const byCat = useMemo(() => groupByCategory(txs), [txs]);
  const insights = useMemo(() => getInsights(txs), [txs]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Visão geral das suas finanças</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <NotificationBell month={month} />
          <select className="filter-select" value={month} onChange={e => setMonth(e.target.value)}>
            {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
          <button className="btn" onClick={() => api.exportExcel(month)}>
            <Download size={15} /> Excel
          </button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={15} /> Nova Transação
          </button>
        </div>
      </div>

      <div className="cards-grid">
        <FinanceCard label="Saldo Atual" value={totals.balance} icon={Wallet} color={totals.balance >= 0 ? 'green' : 'red'} meta="Receitas menos despesas" animClass="anim-1" />
        <FinanceCard label="Receitas" value={totals.income} icon={TrendingUp} color="blue" meta={`${txs.filter(t => t.type === 'income').length} transações`} animClass="anim-2" />
        <FinanceCard label="Despesas" value={totals.expense} icon={TrendingDown} color="red" meta={`${txs.filter(t => t.type === 'expense').length} transações`} animClass="anim-3" />
        <FinanceCard label="Transações" value={txs.length} icon={Calendar} color="purple" meta="no período" animClass="anim-4" />
      </div>

      {insights.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Lightbulb size={17} color="var(--yellow)" /> Insights
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
          <div className="section-title">Mapa de Calor — Gastos por Dia</div>
          <HeatmapChart data={heatmap} month={month} />
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-title">Projeção Financeira — Próximos 6 Meses</div>
        <ProjectionChart data={projection} />
      </div>

      <div className="card">
        <div className="section-title">Últimas Transações</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr>
                {['Descrição', 'Categoria', 'Tipo', 'Valor', 'Data'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {txs.slice(0, 6).map(tx => (
                <tr key={tx.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 500 }}>{tx.description}</td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>{tx.category}</td>
                  <td style={{ padding: '12px 14px' }}><span className={`badge ${tx.type}`}>{tx.type === 'income' ? '↑ Receita' : '↓ Despesa'}</span></td>
                  <td style={{ padding: '12px 14px' }} className={tx.type === 'income' ? 'amount-positive' : 'amount-negative'}>{tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}</td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', fontSize: 13 }}>{new Date(tx.date + 'T12:00').toLocaleDateString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <TransactionModal
          onClose={() => setShowModal(false)}
          onSaved={() => { setShowModal(false); reload(); }}
          onDeleted={() => { setShowModal(false); reload(); }}
        />
      )}
    </div>
  );
}
