import { useMemo } from 'react';
import { formatCurrency } from '../../utils/financialCalculations.js';

export default function HeatmapChart({ data, month }) {
  const max = useMemo(() => Math.max(...(data?.map(d => d.total) || [0]), 1), [data]);

  const days = useMemo(() => {
    if (!month) return [];
    const [y, m] = month.split('-').map(Number);
    const daysInMonth = new Date(y, m, 0).getDate();
    const result = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${month}-${String(d).padStart(2, '0')}`;
      const found = data?.find(r => r.date === dateStr);
      result.push({ day: d, date: dateStr, total: found?.total || 0 });
    }
    return result;
  }, [data, month]);

  const getColor = (val) => {
    if (val === 0) return 'var(--bg)';
    const pct = val / max;
    if (pct < 0.25) return 'rgba(59,130,246,0.3)';
    if (pct < 0.5) return 'rgba(59,130,246,0.55)';
    if (pct < 0.75) return 'rgba(245,158,11,0.7)';
    return 'rgba(255,71,87,0.85)';
  };

  if (!days.length) return <div className="empty-state"><p>Selecione um mês</p></div>;

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5 }}>
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, paddingBottom: 4 }}>{d}</div>
        ))}
        {/* Offset first day */}
        {Array.from({ length: new Date(days[0].date + 'T12:00').getDay() }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map(({ day, date, total }) => (
          <div key={day} title={`${date}: ${formatCurrency(total)}`} style={{
            aspectRatio: '1', borderRadius: 6,
            background: getColor(total),
            border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 600,
            color: total > max * 0.5 ? '#fff' : 'var(--text-secondary)',
            cursor: 'default',
            transition: 'transform 0.1s',
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {day}
          </div>
        ))}
      </div>
      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, fontSize: 11, color: 'var(--text-muted)' }}>
        <span>Menos</span>
        {['rgba(59,130,246,0.3)', 'rgba(59,130,246,0.55)', 'rgba(245,158,11,0.7)', 'rgba(255,71,87,0.85)'].map((c, i) => (
          <div key={i} style={{ width: 16, height: 16, borderRadius: 4, background: c, border: '1px solid var(--border)' }} />
        ))}
        <span>Mais</span>
      </div>
    </div>
  );
}
