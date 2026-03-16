import { useState, useEffect } from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import { api } from '../../api/client.js';
import { useApiMutation } from '../../hooks/useApi.js';

const CATEGORIES = ['Alimentação', 'Moradia', 'Transporte', 'Lazer', 'Saúde', 'Investimentos', 'Salário', 'Freelance', 'Outros'];

const empty = { description: '', amount: '', type: 'expense', category: 'Alimentação', date: new Date().toISOString().slice(0, 10), recurring: false, notes: '' };

export default function TransactionModal({ transaction, onClose, onSaved, onDeleted }) {
  const [form, setForm] = useState(transaction ? { ...transaction, amount: String(transaction.amount), recurring: !!transaction.recurring } : empty);
  const { mutate, loading } = useApiMutation();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.description || !form.amount || !form.date) return;
    await mutate(async () => {
      const data = { ...form, amount: parseFloat(form.amount) };
      const result = transaction
        ? await api.updateTransaction(transaction.id, data)
        : await api.createTransaction(data);
      onSaved(result);
    });
  };

  const handleDelete = async () => {
    if (!confirm('Excluir esta transação?')) return;
    await mutate(async () => {
      await api.deleteTransaction(transaction.id);
      onDeleted(transaction.id);
    });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', width: '100%', maxWidth: 480, padding: 28, boxShadow: 'var(--shadow-lg)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>
            {transaction ? 'Editar Transação' : 'Nova Transação'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {/* Type toggle */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, background: 'var(--bg)', borderRadius: 10, padding: 4 }}>
          {['expense', 'income'].map(t => (
            <button key={t} onClick={() => set('type', t)} style={{
              flex: 1, padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-body)',
              background: form.type === t ? (t === 'income' ? 'var(--accent)' : 'var(--red)') : 'transparent',
              color: form.type === t ? (t === 'income' ? '#0a0a0a' : '#fff') : 'var(--text-secondary)',
              transition: 'all 0.15s',
            }}>
              {t === 'income' ? '↑ Receita' : '↓ Despesa'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Description */}
          <div>
            <label className="filter-label" style={{ display: 'block', marginBottom: 5 }}>Descrição</label>
            <input className="filter-input" style={{ width: '100%' }} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Ex: Supermercado Extra" />
          </div>

          {/* Amount + Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="filter-label" style={{ display: 'block', marginBottom: 5 }}>Valor (R$)</label>
              <input className="filter-input" style={{ width: '100%' }} type="number" min="0" step="0.01" value={form.amount} onChange={e => set('amount', e.target.value)} placeholder="0,00" />
            </div>
            <div>
              <label className="filter-label" style={{ display: 'block', marginBottom: 5 }}>Data</label>
              <input className="filter-input" style={{ width: '100%' }} type="date" value={form.date} onChange={e => set('date', e.target.value)} />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="filter-label" style={{ display: 'block', marginBottom: 5 }}>Categoria</label>
            <select className="filter-select" style={{ width: '100%' }} value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="filter-label" style={{ display: 'block', marginBottom: 5 }}>Observações</label>
            <input className="filter-input" style={{ width: '100%' }} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Opcional..." />
          </div>

          {/* Recurring */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
            <input type="checkbox" checked={form.recurring} onChange={e => set('recurring', e.target.checked)}
              style={{ width: 16, height: 16, accentColor: 'var(--accent)' }} />
            <span>Transação recorrente (mensal)</span>
          </label>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          {transaction && (
            <button className="btn" onClick={handleDelete} disabled={loading} style={{ color: 'var(--red)', borderColor: 'var(--red-dim)' }}>
              <Trash2 size={15} /> Excluir
            </button>
          )}
          <div style={{ flex: 1 }} />
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={loading || !form.description || !form.amount}>
            <Save size={15} /> {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}
