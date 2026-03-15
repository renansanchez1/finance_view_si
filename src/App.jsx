import { useState } from 'react';
import Sidebar from './components/layout/Sidebar.jsx';
import MobileNav from './components/layout/MobileNav.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Transactions from './pages/Transactions.jsx';
import Categories from './pages/Categories.jsx';
import Profile from './pages/Profile.jsx';

const PAGES = {
  dashboard: Dashboard,
  transactions: Transactions,
  categories: Categories,
  profile: Profile,
};

export default function App() {
  const [page, setPage] = useState('dashboard');
  const PageComponent = PAGES[page] || Dashboard;

  return (
    <div className="app-layout">
      <Sidebar page={page} setPage={setPage} />
      <main className="main-content">
        <PageComponent />
      </main>
      <MobileNav page={page} setPage={setPage} />
    </div>
  );
}
