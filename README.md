# 💰 FinanceView v2.0

Dashboard financeiro fullstack — React + Express + SQLite + Recharts.

## ✨ Funcionalidades

### 📊 Dashboard
- Cards de saldo, receitas, despesas
- Gráfico de pizza por categoria
- Mapa de calor de gastos por dia
- Projeção financeira 6 meses
- Insights automáticos
- Notificações de alerta de orçamento

### 💸 Transações
- CRUD completo (criar, editar, excluir)
- Busca dinâmica e filtros
- Transações recorrentes
- Exportar Excel e CSV
- Ordenação por data/valor

### 🏷️ Categorias
- Gráficos de distribuição
- Comparativo mês a mês

### 🎯 Orçamentos
- Limite mensal por categoria
- Barras de progresso em tempo real
- Alertas quando próximo/ultrapassado o limite

### 👤 Perfil
- Edição de dados pessoais
- Metas financeiras com CRUD e prazo
- Histórico financeiro
- Conquistas

## 🚀 Rodando localmente

```bash
npm install

# Terminal 1 - Frontend
npm run dev:frontend

# Terminal 2 - Backend
npm run dev:backend
```

Ou os dois juntos:
```bash
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3001/api

## ☁️ Deploy no Railway

```bash
git init && git add . && git commit -m "financeview v2"
# Push para GitHub, conectar no Railway
```

O Railway usa o `Dockerfile` automaticamente.

## 🗂️ Estrutura

```
├── backend/
│   ├── db/database.js       SQLite + seed
│   ├── routes/
│   │   ├── transactions.js  CRUD
│   │   ├── budgets.js       Orçamentos
│   │   ├── goals.js         Metas
│   │   ├── analytics.js     Heatmap, projeção, alertas
│   │   ├── export.js        Excel/CSV
│   │   └── profile.js
│   └── index.js             Express server
├── src/
│   ├── api/client.js        Fetch wrapper
│   ├── components/
│   │   ├── cards/
│   │   ├── charts/          7 gráficos Recharts
│   │   ├── filters/
│   │   ├── layout/
│   │   ├── modals/          TransactionModal
│   │   └── notifications/   NotificationBell
│   ├── hooks/               useApi, useTheme, useFilters
│   └── pages/               Dashboard, Transactions, Categories, Budgets, Profile
└── Dockerfile
```

## 🛠️ Stack

- **Frontend:** React 18, Vite, Recharts, Lucide
- **Backend:** Express, better-sqlite3
- **Export:** xlsx
- **Deploy:** Docker → Railway
