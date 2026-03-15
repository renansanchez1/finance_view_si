import { useMemo, useState } from 'react';
import { transactions, userProfile } from '../data/transactions.js';
import { calcTotals, groupByMonth, formatCurrency, groupByCategory, getCategoryColor } from '../utils/financialCalculations.js';
import MonthlyChart from '../components/charts/MonthlyChart.jsx';
import { User, Mail, Briefcase, Target, TrendingUp, Award, Star, Edit3, Check } from 'lucide-react';

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(userProfile);
  const [draft, setDraft] = useState(userProfile);

  const allTotals = useMemo(() => calcTotals(transactions), []);
  const byMonth = useMemo(() => groupByMonth(transactions), []);
  const byCat = useMemo(() => groupByCategory(transactions), []);
  const totalExp = byCat.reduce((s, c) => s + c.value, 0);

  const savingsPct = Math.min(100, (profile.currentSavings / profile.savingsGoal) * 100);
  const monthlyBalance = allTotals.income - allTotals.expense;
  const goalPct = Math.min(100, (monthlyBalance / profile.monthlyGoal) * 100);

  const handleSave = () => {
    setProfile(draft);
    setEditing(false);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Meu Perfil</h1>
          <p className="page-subtitle">Suas informações e metas financeiras</p>
        </div>
        <button
          className={editing ? 'btn btn-primary' : 'btn'}
          onClick={editing ? handleSave : () => setEditing(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          {editing ? <><Check size={15} /> Salvar</> : <><Edit3 size={15} /> Editar</>}
        </button>
      </div>

      <div className="two-col" style={{ marginBottom: 24, alignItems: 'start' }}>
        {/* Profile card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
            <div className="profile-avatar-lg">{profile.avatar}</div>
            <div>
              {editing ? (
                <input
                  value={draft.name}
                  onChange={e => setDraft({ ...draft, name: e.target.value })}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 22,
                    fontWeight: 700,
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: '4px 10px',
                    color: 'var(--text-primary)',
                    width: '100%',
                    marginBottom: 4,
                  }}
                />
              ) : (
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, letterSpacing: '-0.3px' }}>
                  {profile.name}
                </div>
              )}
              <div style={{ color: 'var(--text-secondary)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Briefcase size={13} /> {profile.occupation}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
              <Mail size={15} color="var(--text-secondary)" />
              {editing ? (
                <input
                  value={draft.email}
                  onChange={e => setDraft({ ...draft, email: e.target.value })}
                  style={{
                    flex: 1, background: 'var(--bg)', border: '1px solid var(--border)',
                    borderRadius: 8, padding: '6px 10px', color: 'var(--text-primary)',
                    fontFamily: 'var(--font-body)', fontSize: 14,
                  }}
                />
              ) : (
                <span>{profile.email}</span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
              <User size={15} color="var(--text-secondary)" />
              <span style={{ color: 'var(--text-secondary)' }}>
                Membro desde {new Date(profile.joinDate + 'T12:00').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>

          <div className="stat-grid" style={{ marginTop: 24 }}>
            <div className="stat-box">
              <div className="value" style={{ color: 'var(--accent)' }}>{formatCurrency(allTotals.income)}</div>
              <div className="label">Receitas</div>
            </div>
            <div className="stat-box">
              <div className="value" style={{ color: 'var(--red)' }}>{formatCurrency(allTotals.expense)}</div>
              <div className="label">Despesas</div>
            </div>
            <div className="stat-box">
              <div className="value" style={{ color: allTotals.balance >= 0 ? 'var(--accent)' : 'var(--red)' }}>
                {formatCurrency(allTotals.balance)}
              </div>
              <div className="label">Saldo</div>
            </div>
          </div>
        </div>

        {/* Goals */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <Target size={17} color="var(--accent)" />
              <div className="section-title" style={{ margin: 0 }}>Metas Financeiras</div>
            </div>

            {/* Savings goal */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
                <span style={{ fontWeight: 600 }}>Reserva de Emergência</span>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {formatCurrency(profile.currentSavings)} / {formatCurrency(profile.savingsGoal)}
                </span>
              </div>
              <div className="progress-wrap">
                <div className="progress-fill" style={{ width: `${savingsPct}%` }} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 5 }}>
                {savingsPct.toFixed(0)}% concluído
              </div>
            </div>

            {/* Monthly savings goal */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
                <span style={{ fontWeight: 600 }}>Meta de Economia Mensal</span>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {formatCurrency(monthlyBalance)} / {formatCurrency(profile.monthlyGoal)}
                </span>
              </div>
              <div className="progress-wrap">
                <div className="progress-fill" style={{
                  width: `${Math.max(0, goalPct)}%`,
                  background: goalPct >= 100 ? 'var(--accent)' : goalPct > 50 ? 'var(--blue)' : 'var(--yellow)',
                }} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 5 }}>
                {goalPct >= 100 ? '✓ Meta atingida!' : `${goalPct.toFixed(0)}% da meta mensal`}
              </div>
            </div>

            {editing && (
              <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>
                    META MENSAL (R$)
                  </label>
                  <input
                    type="number"
                    value={draft.monthlyGoal}
                    onChange={e => setDraft({ ...draft, monthlyGoal: +e.target.value })}
                    className="filter-input"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>
                    META DE RESERVA (R$)
                  </label>
                  <input
                    type="number"
                    value={draft.savingsGoal}
                    onChange={e => setDraft({ ...draft, savingsGoal: +e.target.value })}
                    className="filter-input"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Achievements */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Award size={17} color="var(--yellow)" />
              <div className="section-title" style={{ margin: 0 }}>Conquistas</div>
            </div>
            {[
              { icon: '💰', label: 'Primeiro Salário', desc: 'Registrou primeira receita', done: true },
              { icon: '📊', label: 'Analista', desc: 'Explorou todos os dashboards', done: true },
              { icon: '🎯', label: 'Meta Batida', desc: 'Atingiu meta de economia', done: goalPct >= 100 },
              { icon: '🏦', label: 'Reserva 70%', desc: 'Reserva de emergência em 70%+', done: savingsPct >= 70 },
            ].map((a, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 0',
                borderBottom: i < 3 ? '1px solid var(--border)' : 'none',
                opacity: a.done ? 1 : 0.4,
              }}>
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

      {/* Monthly chart */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="section-title">Histórico Financeiro</div>
        <MonthlyChart data={byMonth} />
      </div>

      {/* Top categories */}
      <div className="card">
        <div className="section-title">Maiores Gastos por Categoria</div>
        {byCat.slice(0, 5).map((cat, i) => {
          const pct = totalExp > 0 ? (cat.value / totalExp) * 100 : 0;
          const color = getCategoryColor(cat.name);
          return (
            <div key={cat.name} className="cat-item">
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 2 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{cat.name}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color }}>{formatCurrency(cat.value)}</span>
                </div>
                <div className="cat-bar-wrap">
                  <div className="cat-bar" style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', minWidth: 38, textAlign: 'right' }}>
                {pct.toFixed(0)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
