import { useState, useEffect } from 'react';
import { Bell, X, AlertTriangle, AlertCircle } from 'lucide-react';
import { api } from '../../api/client.js';
import { formatCurrency } from '../../utils/financialCalculations.js';

export default function NotificationBell({ month }) {
  const [alerts, setAlerts] = useState([]);
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState([]);

  useEffect(() => {
    api.getAlerts(month).then(setAlerts).catch(() => {});
  }, [month]);

  const visible = alerts.filter((_, i) => !dismissed.includes(i));

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 10, padding: '7px 10px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
          color: visible.length > 0 ? 'var(--yellow)' : 'var(--text-secondary)',
          position: 'relative',
        }}
      >
        <Bell size={17} />
        {visible.length > 0 && (
          <span style={{
            position: 'absolute', top: -4, right: -4,
            background: 'var(--red)', color: '#fff',
            borderRadius: '50%', width: 16, height: 16,
            fontSize: 10, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{visible.length}</span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, marginTop: 8,
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)',
          width: 320, zIndex: 200, overflow: 'hidden',
        }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>Alertas de Orçamento</span>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <X size={15} />
            </button>
          </div>

          {visible.length === 0 ? (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              ✅ Nenhum alerta no momento
            </div>
          ) : (
            visible.map((alert, i) => (
              <div key={i} style={{
                padding: '12px 16px', borderBottom: '1px solid var(--border)',
                display: 'flex', gap: 10, alignItems: 'flex-start',
                background: alert.type === 'danger' ? 'var(--red-dim)' : 'var(--yellow-dim)',
              }}>
                {alert.type === 'danger'
                  ? <AlertCircle size={16} color="var(--red)" style={{ flexShrink: 0, marginTop: 1 }} />
                  : <AlertTriangle size={16} color="var(--yellow)" style={{ flexShrink: 0, marginTop: 1 }} />
                }
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{alert.message}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    {formatCurrency(alert.spent)} de {formatCurrency(alert.limit)}
                  </div>
                </div>
                <button onClick={() => setDismissed(d => [...d, i])} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}>
                  <X size={13} />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
