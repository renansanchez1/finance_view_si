import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency, getCategoryColor } from '../../utils/financialCalculations.js';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: '10px 14px',
      boxShadow: 'var(--shadow)',
      fontSize: 13,
    }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{d.name}</div>
      <div style={{ color: d.payload.fill }}>{formatCurrency(d.value)}</div>
      <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
        {d.payload.percent}%
      </div>
    </div>
  );
};

export default function CategoryChart({ data }) {
  if (!data.length) return <div className="empty-state"><p>Sem despesas neste período</p></div>;

  const total = data.reduce((s, d) => s + d.value, 0);
  const enriched = data.map(d => ({
    ...d,
    fill: getCategoryColor(d.name),
    percent: ((d.value / total) * 100).toFixed(1),
  }));

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={enriched}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={105}
            paddingAngle={3}
            dataKey="value"
          >
            {enriched.map((entry, i) => (
              <Cell key={i} fill={entry.fill} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
