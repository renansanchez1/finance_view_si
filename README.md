# 💰 FinanceView

Dashboard financeiro moderno e responsivo — construído com React + Recharts + Vite.

## ✨ Features

- **Dashboard** com métricas, gráficos de pizza e linha, insights automáticos
- **Transações** com busca, filtros por mês/tipo/categoria e ordenação
- **Categorias** com barras de progresso, gráfico de pizza e comparativo
- **Perfil** com metas, progresso de reserva e conquistas
- **Dark mode** com persistência via localStorage
- **Responsivo** — sidebar no desktop, bottom nav no mobile

## 🚀 Rodando localmente

```bash
npm install
npm run dev
```

Acesse: http://localhost:5173

## 🏗️ Build

```bash
npm run build
npm run preview
```

## ☁️ Deploy no Railway

1. Faça push para um repositório GitHub
2. Acesse [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
3. Selecione o repositório
4. Railway detecta automaticamente via `railway.json` e `nixpacks.toml`
5. O deploy roda `npm run build` e serve com `vite preview`

A variável `PORT` é injetada automaticamente pelo Railway.

## 🗂️ Estrutura

```
src/
├── components/
│   ├── cards/         FinanceCard
│   ├── charts/        CategoryChart, MonthlyChart, ExpenseBarChart
│   ├── filters/       FilterBar
│   ├── layout/        Sidebar, MobileNav
│   └── table/         TransactionsTable
├── data/              transactions.js
├── hooks/             useFilters.js, useTheme.js
├── pages/             Dashboard, Transactions, Categories, Profile
└── utils/             financialCalculations.js
```

## 🛠️ Stack

- React 18
- Vite 6
- Recharts
- Lucide React
- date-fns
- Fontes: Syne + DM Sans
