import { LayoutDashboard, ArrowLeftRight, Tag, User, Sun, Moon, Target } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme.js';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transações', icon: ArrowLeftRight },
  { id: 'categories', label: 'Categorias', icon: Tag },
  { id: 'budgets', label: 'Orçamentos', icon: Target },
  { id: 'profile', label: 'Perfil', icon: User },
];

export default function Sidebar({ page, setPage }) {
  const { dark, toggle } = useTheme();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">FV</div>
        <span className="sidebar-logo-text">Finance<span>View</span></span>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Menu</div>
        {navItems.map(({ id, label, icon: Icon }) => (
          <button key={id} className={`nav-item${page === id ? ' active' : ''}`} onClick={() => setPage(id)}>
            <Icon className="nav-icon" size={18} />
            {label}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button className="nav-item" onClick={toggle} style={{ color: 'rgba(255,255,255,0.5)' }}>
          {dark ? <Sun className="nav-icon" size={18} /> : <Moon className="nav-icon" size={18} />}
          {dark ? 'Modo Claro' : 'Modo Escuro'}
        </button>
      </div>
    </aside>
  );
}
