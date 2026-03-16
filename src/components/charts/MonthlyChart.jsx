import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Area, AreaChart
} from 'recharts';
import { formatCurrency } from '../../utils/financialCalculations.js';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: '10px 14px',
      boxShadow: 'var(--shadow)',
      fontSize: 13,
    }}>
      <div style={{ fontWeight: 600, marginBottom: 6, textTransform: 'capitalize' }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color, marginBottom: 2 }}>
          {p.name === 'income' ? 'Receitas' : 'Despesas'}: {formatCurrency(p.value)}
        </div>
      ))}
    </div>
  );
};

export default function MonthlyChart({ data }) {
  if (!data.length) return <div className="empty-state"><p>Sem dados mensais</p></div>;

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00d084" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#00d084" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff4757" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#ff4757" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: 'var(--text-secondary)', fontFamily: 'DM Sans' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--text-secondary)', fontFamily: 'DM Sans' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
            width={50}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                {value === 'income' ? 'Receitas' : 'Despesas'}
              </span>
            )}
          />
          <Area type="monotone" dataKey="income" stroke="#00d084" strokeWidth={2.5}
            fill="url(#colorIncome)" dot={{ fill: '#00d084', r: 4, strokeWidth: 0 }} />
          <Area type="monotone" dataKey="expense" stroke="#ff4757" strokeWidth={2.5}
            fill="url(#colorExpense)" dot={{ fill: '#ff4757', r: 4, strokeWidth: 0 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
