import { LayoutDashboard, ArrowLeftRight, Tag, User, Target } from 'lucide-react';

const items = [
  { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transações', icon: ArrowLeftRight },
  { id: 'budgets', label: 'Orçamentos', icon: Target },
  { id: 'categories', label: 'Categorias', icon: Tag },
  { id: 'profile', label: 'Perfil', icon: User },
];

export default function MobileNav({ page, setPage }) {
  return (
    <nav className="mobile-nav">
      <div className="mobile-nav-inner">
        {items.map(({ id, label, icon: Icon }) => (
          <button key={id} className={`mobile-nav-item${page === id ? ' active' : ''}`} onClick={() => setPage(id)}>
            <Icon size={20} />
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}
