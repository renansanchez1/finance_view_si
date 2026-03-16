import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Apply saved theme before render to avoid flash
const saved = localStorage.getItem('fv-theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.setAttribute('data-theme', saved || (prefersDark ? 'dark' : 'light'));

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
