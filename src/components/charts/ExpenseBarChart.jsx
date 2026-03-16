import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatCurrency, getCategoryColor } from '../../utils/financialCalculations.js';

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
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
      <div style={{ color: getCategoryColor(label) }}>{formatCurrency(payload[0].value)}</div>
    </div>
  );
};

export default function ExpenseBarChart({ data }) {
  if (!data.length) return <div className="empty-state"><p>Sem despesas neste período</p></div>;

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 30 }} barSize={28}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: 'var(--text-secondary)', fontFamily: 'DM Sans' }}
            axisLine={false}
            tickLine={false}
            angle={-35}
            textAnchor="end"
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--text-secondary)', fontFamily: 'DM Sans' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `R$${(v / 1000).toFixed(1)}k`}
            width={55}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg)', radius: 6 }} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={getCategoryColor(entry.name)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
