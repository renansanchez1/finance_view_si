import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/financialCalculations.js';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', boxShadow: 'var(--shadow)', fontSize: 13 }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: {formatCurrency(p.value)}
        </div>
      ))}
    </div>
  );
};

export default function CompareChart({ data, month1, month2 }) {
  if (!data?.length) return <div className="empty-state"><p>Selecione dois meses para comparar</p></div>;
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 30 }} barGap={4} barSize={18}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="category" tick={{ fontSize: 11, fill: 'var(--text-secondary)', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} angle={-30} textAnchor="end" />
          <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} tickFormatter={v => `R$${(v / 1000).toFixed(1)}k`} width={55} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg)', radius: 4 }} />
          <Legend formatter={v => <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{v}</span>} />
          <Bar dataKey={month1} name={month1} fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey={month2} name={month2} fill="#8b5cf6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
