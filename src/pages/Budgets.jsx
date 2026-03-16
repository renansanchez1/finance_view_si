import { useState } from 'react';
import { Plus, Edit3, Trash2, Check, X, Target } from 'lucide-react';
import { useApi, useApiMutation } from '../hooks/useApi.js';
import { api } from '../api/client.js';
import { formatCurrency, getCategoryColor, MONTHS } from '../utils/financialCalculations.js';

const CATEGORIES = ['Alimentação', 'Moradia', 'Transporte', 'Lazer', 'Saúde', 'Investimentos', 'Outros'];

export default function Budgets() {
  const [month, setMonth] = useState('2026-03');
  const [editId, setEditId] = useState(null);
  const [editVal, setEditVal] = useState('');
  const [newForm, setNewForm] = useState({ category: 'Alimentação', monthly_limit: '' });
  const [showNew, setShowNew] = useState(false);

  const { data: budgets = [], reload } = useApi(() => api.getBudgets(month), [month]);
  const { mutate } = useApiMutation();

  const handleSaveEdit = async (id) => {
    await mutate(() => api.updateBudget(id, { monthly_limit: parseFloat(editVal) }));
    setEditId(null);
    reload();
  };

  const handleDelete = async (id) => {
    if (!confirm('Excluir este orçamento?')) return;
    await mutate(() => api.deleteBudget(id));
    reload();
  };

  const handleCreate = async () => {
    if (!newForm.monthly_limit) return;
    await mutate(() => api.createBudget({ ...newForm, monthly_limit: parseFloat(newForm.monthly_limit) }));
    setShowNew(false);
    setNewForm({ category: 'Alimentação', monthly_limit: '' });
    reload();
  };

  const totalBudget = budgets.reduce((s, b) => s + b.monthly_limit, 0);
  const totalSpent = budgets.reduce((s, b) => s + (b.spent || 0), 0);
  const overBudget = budgets.filter(b => (b.pct || 0) >= 100).length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Orçamentos</h1>
          <p className="page-subtitle">Controle de limite por categoria</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <select className="filter-select" value={month} onChange={e => setMonth(e.target.value)}>
            {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
          <button className="btn btn-primary" onClick={() => setShowNew(true)}>
            <Plus size={15} /> Novo Orçamento
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="cards-grid" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Orçado', value: formatCurrency(totalBudget), color: '#3b82f6' },
          { label: 'Total Gasto', value: formatCurrency(totalSpent), color: 'var(--red)' },
          { label: 'Restante', value: formatCurrency(totalBudget - totalSpent), color: 'var(--accent)' },
          { label: 'Categorias no Limite', value: overBudget, color: overBudget > 0 ? 'var(--red)' : 'var(--accent)' },
        ].map((c, i) => (
          <div key={i} className={`finance-card anim-${i + 1}`}>
            <div className="fc-top">
              <span className="fc-label">{c.label}</span>
              <Target size={17} color={c.color} />
            </div>
            <div className="fc-value" style={{ color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* New budget form */}
      {showNew && (
        <div className="card" style={{ marginBottom: 20, borderTop: '3px solid var(--accent)' }}>
          <div className="section-title">Novo Orçamento</div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div className="filter-group">
              <label className="filter-label">Categoria</label>
              <select className="filter-select" value={newForm.category} onChange={e => setNewForm(f => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Limite Mensal (R$)</label>
              <input type="number" className="filter-input" placeholder="0,00" value={newForm.monthly_limit}
                onChange={e => setNewForm(f => ({ ...f, monthly_limit: e.target.value }))} />
            </div>
            <button className="btn btn-primary" onClick={handleCreate} disabled={!newForm.monthly_limit}>
              <Check size={15} /> Salvar
            </button>
            <button className="btn" onClick={() => setShowNew(false)}>
              <X size={15} /> Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Budget list */}
      <div className="card">
        <div className="section-title">Orçamentos por Categoria</div>
        {budgets.length === 0 ? (
          <div className="empty-state"><p>Nenhum orçamento cadastrado</p></div>
        ) : (
          budgets.map(b => {
            const pct = b.pct || 0;
            const color = pct >= 100 ? 'var(--red)' : pct >= 80 ? 'var(--yellow)' : getCategoryColor(b.category);
            const isEditing = editId === b.id;

            return (
              <div key={b.id} style={{ padding: '18px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: getCategoryColor(b.category) + '22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ width: 12, height: 12, borderRadius: '50%', background: getCategoryColor(b.category), display: 'block' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{b.category}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        {formatCurrency(b.spent || 0)} de {' '}
                        {isEditing ? (
                          <input
                            type="number"
                            value={editVal}
                            onChange={e => setEditVal(e.target.value)}
                            style={{ width: 90, padding: '2px 6px', fontSize: 12, borderRadius: 6, border: '1px solid var(--accent)', background: 'var(--bg)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
                            autoFocus
                          />
                        ) : (
                          <span style={{ color }}>{formatCurrency(b.monthly_limit)}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      fontSize: 13, fontWeight: 700, color,
                      background: color === 'var(--red)' ? 'var(--red-dim)' : color === 'var(--yellow)' ? 'var(--yellow-dim)' : 'var(--accent-dim)',
                      padding: '3px 10px', borderRadius: 20,
                    }}>
                      {pct.toFixed(0)}%
                    </span>
                    {isEditing ? (
                      <>
                        <button className="btn" style={{ padding: '5px 10px' }} onClick={() => handleSaveEdit(b.id)}><Check size={14} /></button>
                        <button className="btn" style={{ padding: '5px 10px' }} onClick={() => setEditId(null)}><X size={14} /></button>
                      </>
                    ) : (
                      <>
                        <button className="btn" style={{ padding: '5px 10px' }} onClick={() => { setEditId(b.id); setEditVal(String(b.monthly_limit)); }}><Edit3 size={14} /></button>
                        <button className="btn" style={{ padding: '5px 10px', color: 'var(--red)' }} onClick={() => handleDelete(b.id)}><Trash2 size={14} /></button>
                      </>
                    )}
                  </div>
                </div>

                <div style={{ height: 8, background: 'var(--bg)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 99,
                    width: `${Math.min(100, pct)}%`,
                    background: color,
                    transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
                  }} />
                </div>

                {pct >= 80 && (
                  <div style={{ fontSize: 12, color: pct >= 100 ? 'var(--red)' : 'var(--yellow)', marginTop: 6, fontWeight: 500 }}>
                    {pct >= 100 ? `⚠ Limite ultrapassado em ${formatCurrency((b.spent || 0) - b.monthly_limit)}` : `⚡ ${formatCurrency(b.remaining || 0)} restantes`}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
