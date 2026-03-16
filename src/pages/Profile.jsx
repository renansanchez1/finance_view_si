import { useState, useMemo } from 'react';
import { useApi, useApiMutation } from '../hooks/useApi.js';
import { api } from '../api/client.js';
import { calcTotals, groupByMonth, formatCurrency, groupByCategory, getCategoryColor } from '../utils/financialCalculations.js';
import MonthlyChart from '../components/charts/MonthlyChart.jsx';
import { User, Mail, Briefcase, Target, Award, Star, Edit3, Check, Plus, Trash2 } from 'lucide-react';

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(null);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalForm, setGoalForm] = useState({ name: '', target_amount: '', current_amount: '', deadline: '', color: '#00d084' });

  const { data: profile, reload: reloadProfile } = useApi(() => api.getProfile(), []);
  const { data: goals = [], reload: reloadGoals } = useApi(() => api.getGoals(), []);
  const { data: txs = [] } = useApi(() => api.getTransactions({}), []);
  const { mutate } = useApiMutation();

  const allTotals = useMemo(() => calcTotals(txs), [txs]);
  const byMonth = useMemo(() => groupByMonth(txs), [txs]);
  const byCat = useMemo(() => groupByCategory(txs), [txs]);
  const totalExp = byCat.reduce((s, c) => s + c.value, 0);

  const handleEdit = () => { setDraft({ ...profile }); setEditing(true); };
  const handleSave = async () => {
    await mutate(() => api.updateProfile(draft));
    setEditing(false);
    reloadProfile();
  };

  const handleCreateGoal = async () => {
    if (!goalForm.name || !goalForm.target_amount) return;
    await mutate(() => api.createGoal({ ...goalForm, target_amount: parseFloat(goalForm.target_amount), current_amount: parseFloat(goalForm.current_amount || 0) }));
    setShowGoalForm(false);
    setGoalForm({ name: '', target_amount: '', current_amount: '', deadline: '', color: '#00d084' });
    reloadGoals();
  };

  const handleDeleteGoal = async (id) => {
    if (!confirm('Excluir esta meta?')) return;
    await mutate(() => api.deleteGoal(id));
    reloadGoals();
  };

  if (!profile) return <div style={{ padding: 32, color: 'var(--text-secondary)' }}>Carregando...</div>;
  const p = editing ? draft : profile;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Meu Perfil</h1>
          <p className="page-subtitle">Informações e metas financeiras</p>
        </div>
        <button className={editing ? 'btn btn-primary' : 'btn'} onClick={editing ? handleSave : handleEdit}>
          {editing ? <><Check size={15} /> Salvar</> : <><Edit3 size={15} /> Editar</>}
        </button>
      </div>

      <div className="two-col" style={{ marginBottom: 24, alignItems: 'start' }}>
        {/* Profile card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
            <div className="profile-avatar-lg">{p?.avatar || '?'}</div>
            <div style={{ flex: 1 }}>
              {editing ? (
                <input value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
                  style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '4px 10px', color: 'var(--text-primary)', width: '100%', marginBottom: 4 }} />
              ) : (
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, letterSpacing: '-0.3px' }}>{p.name}</div>
              )}
              <div style={{ color: 'var(--text-secondary)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Briefcase size={13} />
                {editing ? (
                  <input value={draft.occupation} onChange={e => setDraft(d => ({ ...d, occupation: e.target.value }))}
                    style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, padding: '3px 8px', fontSize: 13, color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }} />
                ) : p.occupation}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
              <Mail size={15} color="var(--text-secondary)" />
              {editing ? (
                <input value={draft.email} onChange={e => setDraft(d => ({ ...d, email: e.target.value }))}
                  className="filter-input" style={{ flex: 1 }} />
              ) : <span>{p.email}</span>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
              <User size={15} color="var(--text-secondary)" />
              <span style={{ color: 'var(--text-secondary)' }}>Membro desde {new Date((p.join_date || '2025-01-01') + 'T12:00').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
            </div>
          </div>

          <div className="stat-grid" style={{ marginTop: 24 }}>
            <div className="stat-box"><div className="value" style={{ color: 'var(--accent)' }}>{formatCurrency(allTotals.income)}</div><div className="label">Receitas</div></div>
            <div className="stat-box"><div className="value" style={{ color: 'var(--red)' }}>{formatCurrency(allTotals.expense)}</div><div className="label">Despesas</div></div>
            <div className="stat-box"><div className="value" style={{ color: allTotals.balance >= 0 ? 'var(--accent)' : 'var(--red)' }}>{formatCurrency(allTotals.balance)}</div><div className="label">Saldo</div></div>
          </div>

          {editing && (
            <div style={{ marginTop: 16 }}>
              <label className="filter-label" style={{ display: 'block', marginBottom: 5 }}>META MENSAL (R$)</label>
              <input type="number" className="filter-input" style={{ width: '100%' }} value={draft.monthly_goal}
                onChange={e => setDraft(d => ({ ...d, monthly_goal: e.target.value }))} />
            </div>
          )}
        </div>

        {/* Goals */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Target size={17} color="var(--accent)" />
                <div className="section-title" style={{ margin: 0 }}>Metas Financeiras</div>
              </div>
              <button className="btn" style={{ padding: '5px 10px', fontSize: 13 }} onClick={() => setShowGoalForm(s => !s)}>
                <Plus size={13} /> Meta
              </button>
            </div>

            {showGoalForm && (
              <div style={{ background: 'var(--bg)', borderRadius: 10, padding: 14, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input className="filter-input" style={{ width: '100%' }} placeholder="Nome da meta" value={goalForm.name} onChange={e => setGoalForm(f => ({ ...f, name: e.target.value }))} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <input type="number" className="filter-input" placeholder="Valor alvo (R$)" value={goalForm.target_amount} onChange={e => setGoalForm(f => ({ ...f, target_amount: e.target.value }))} />
                  <input type="number" className="filter-input" placeholder="Já economizado" value={goalForm.current_amount} onChange={e => setGoalForm(f => ({ ...f, current_amount: e.target.value }))} />
                </div>
                <input type="date" className="filter-input" style={{ width: '100%' }} value={goalForm.deadline} onChange={e => setGoalForm(f => ({ ...f, deadline: e.target.value }))} />
                <div style={{ display: 'flex', gap: 8 }}>
                  {['#00d084', '#3b82f6', '#8b5cf6', '#f59e0b', '#ff4757'].map(c => (
                    <div key={c} onClick={() => setGoalForm(f => ({ ...f, color: c }))} style={{ width: 24, height: 24, borderRadius: '50%', background: c, cursor: 'pointer', border: goalForm.color === c ? '3px solid var(--text-primary)' : '2px solid transparent', transition: 'border 0.15s' }} />
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-primary" onClick={handleCreateGoal}><Check size={14} /> Criar</button>
                  <button className="btn" onClick={() => setShowGoalForm(false)}><X size={14} /></button>
                </div>
              </div>
            )}

            {goals.map(g => {
              const pct = Math.min(100, (g.current_amount / g.target_amount) * 100);
              return (
                <div key={g.id} style={{ marginBottom: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6 }}>
                    <span style={{ fontWeight: 600 }}>{g.name}</span>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{formatCurrency(g.current_amount)} / {formatCurrency(g.target_amount)}</span>
                      <button onClick={() => handleDeleteGoal(g.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}><Trash2 size={13} /></button>
                    </div>
                  </div>
                  <div className="progress-wrap">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${g.color}, ${g.color}99)` }} />
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                    <span>{pct.toFixed(0)}% {pct >= 100 ? '✓ Concluída!' : 'concluído'}</span>
                    {g.deadline && <span>Prazo: {new Date(g.deadline + 'T12:00').toLocaleDateString('pt-BR')}</span>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Award size={17} color="var(--yellow)" />
              <div className="section-title" style={{ margin: 0 }}>Conquistas</div>
            </div>
            {[
              { icon: '💰', label: 'Primeiro Salário', desc: 'Registrou primeira receita', done: allTotals.income > 0 },
              { icon: '📊', label: 'Analista', desc: 'Explorou todos os dashboards', done: true },
              { icon: '🎯', label: 'Economizador', desc: 'Poupou mais de 20% da renda', done: allTotals.income > 0 && (allTotals.balance / allTotals.income) >= 0.2 },
              { icon: '🏆', label: 'Metas no Foco', desc: 'Criou 3 ou mais metas', done: goals.length >= 3 },
            ].map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none', opacity: a.done ? 1 : 0.4 }}>
                <div style={{ fontSize: 22, width: 36, textAlign: 'center' }}>{a.icon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{a.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{a.desc}</div>
                </div>
                {a.done && <Star size={14} color="var(--yellow)" style={{ marginLeft: 'auto' }} fill="var(--yellow)" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="section-title">Histórico Financeiro</div>
        <MonthlyChart data={byMonth} />
      </div>

      <div className="card">
        <div className="section-title">Maiores Gastos por Categoria</div>
        {byCat.slice(0, 5).map(cat => {
          const pct = totalExp > 0 ? (cat.value / totalExp) * 100 : 0;
          const color = getCategoryColor(cat.name);
          return (
            <div key={cat.name} className="cat-item">
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{cat.name}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color }}>{formatCurrency(cat.value)}</span>
                </div>
                <div className="cat-bar-wrap">
                  <div className="cat-bar" style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', minWidth: 38, textAlign: 'right' }}>{pct.toFixed(0)}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
