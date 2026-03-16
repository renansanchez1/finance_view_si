import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { formatCurrency } from '../../utils/financialCalculations.js';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const isProjected = payload[0]?.payload?.projected;
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 10, padding: '10px 14px', boxShadow: 'var(--shadow)', fontSize: 13,
    }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>
        {label} {isProjected && <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>(projeção)</span>}
      </div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color, marginBottom: 2 }}>
          {p.name === 'income' ? 'Receitas' : 'Despesas'}: {formatCurrency(p.value)}
        </div>
      ))}
      <div style={{ borderTop: '1px solid var(--border)', marginTop: 6, paddingTop: 6, fontWeight: 600 }}>
        Saldo: {formatCurrency((payload.find(p => p.name === 'income')?.value || 0) - (payload.find(p => p.name === 'expense')?.value || 0))}
      </div>
    </div>
  );
};

export default function ProjectionChart({ data }) {
  if (!data?.length) return <div className="empty-state"><p>Sem dados suficientes para projeção</p></div>;

  const enriched = data.map(d => ({
    ...d,
    label: format(parseISO(d.month + '-01'), 'MMM yy', { locale: ptBR }),
  }));

  const splitIdx = enriched.findIndex(d => d.projected);

  return (
    <div className="chart-container">
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, display: 'flex', gap: 16 }}>
        <span>— Histórico real</span>
        <span style={{ opacity: 0.6 }}>- - Projeção (média 3 meses)</span>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={enriched} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="projIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00d084" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#00d084" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="projExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff4757" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#ff4757" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-secondary)', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} width={50} />
          <Tooltip content={<CustomTooltip />} />
          <Legend formatter={v => <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{v === 'income' ? 'Receitas' : 'Despesas'}</span>} />
          {splitIdx > 0 && <ReferenceLine x={enriched[splitIdx]?.label} stroke="var(--text-muted)" strokeDasharray="4 4" label={{ value: 'Projeção', fill: 'var(--text-muted)', fontSize: 11 }} />}
          <Area type="monotone" dataKey="income" stroke="#00d084" strokeWidth={2} strokeDasharray={data => data.projected ? '5 5' : '0'} fill="url(#projIncome)" dot={false} />
          <Area type="monotone" dataKey="expense" stroke="#ff4757" strokeWidth={2} fill="url(#projExpense)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
