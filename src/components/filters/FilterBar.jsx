import { Search, SlidersHorizontal } from 'lucide-react';
import { MONTHS } from '../../utils/financialCalculations.js';

export default function FilterBar({ filters, showSearch = true, showSort = false }) {
  const { month, setMonth, type, setType, category, setCategory, search, setSearch, categories } = filters;

  return (
    <div className="filter-bar">
      {showSearch && (
        <div className="filter-group" style={{ maxWidth: 240 }}>
          <label className="filter-label">
            <Search size={11} style={{ display: 'inline', marginRight: 4 }} />
            Buscar
          </label>
          <input
            className="filter-input"
            placeholder="Pesquisar..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      )}

      <div className="filter-group">
        <label className="filter-label">Mês</label>
        <select className="filter-select" value={month} onChange={e => setMonth(e.target.value)}>
          {MONTHS.map(m => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Tipo</label>
        <select className="filter-select" value={type} onChange={e => setType(e.target.value)}>
          <option value="">Todos</option>
          <option value="income">Receitas</option>
          <option value="expense">Despesas</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Categoria</label>
        <select className="filter-select" value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">Todas</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {filters.setMonth && (
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button
            className="btn"
            onClick={() => { setMonth(''); setType(''); setCategory(''); setSearch && setSearch(''); }}
            style={{ whiteSpace: 'nowrap' }}
          >
            Limpar
          </button>
        </div>
      )}
    </div>
  );
}
