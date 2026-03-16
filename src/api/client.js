const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const api = {
  // Transactions
  getTransactions: (params = {}) => request('/transactions?' + new URLSearchParams(params)),
  createTransaction: (data) => request('/transactions', { method: 'POST', body: data }),
  updateTransaction: (id, data) => request(`/transactions/${id}`, { method: 'PUT', body: data }),
  deleteTransaction: (id) => request(`/transactions/${id}`, { method: 'DELETE' }),
  getCategories: () => request('/transactions/meta/categories'),

  // Budgets
  getBudgets: (month) => request(`/budgets${month ? `?month=${month}` : ''}`),
  createBudget: (data) => request('/budgets', { method: 'POST', body: data }),
  updateBudget: (id, data) => request(`/budgets/${id}`, { method: 'PUT', body: data }),
  deleteBudget: (id) => request(`/budgets/${id}`, { method: 'DELETE' }),

  // Goals
  getGoals: () => request('/goals'),
  createGoal: (data) => request('/goals', { method: 'POST', body: data }),
  updateGoal: (id, data) => request(`/goals/${id}`, { method: 'PUT', body: data }),
  deleteGoal: (id) => request(`/goals/${id}`, { method: 'DELETE' }),

  // Analytics
  getMonthly: () => request('/analytics/monthly'),
  getCompare: (m1, m2) => request(`/analytics/compare?month1=${m1}&month2=${m2}`),
  getHeatmap: (month) => request(`/analytics/heatmap${month ? `?month=${month}` : ''}`),
  getProjection: () => request('/analytics/projection'),
  getAlerts: (month) => request(`/analytics/alerts${month ? `?month=${month}` : ''}`),

  // Profile
  getProfile: () => request('/profile'),
  updateProfile: (data) => request('/profile', { method: 'PUT', body: data }),

  // Export (direct download)
  exportExcel: (month) => {
    window.open(`/api/export/excel${month ? `?month=${month}` : ''}`, '_blank');
  },
  exportCsv: (month) => {
    window.open(`/api/export/csv${month ? `?month=${month}` : ''}`, '_blank');
  },
};
