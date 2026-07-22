import { useEffect, useState } from 'react';

export default function ThemeToggle({ className = '' }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('cq_theme') || 'dark'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cq_theme', theme);
  }, [theme]);

  return (
    <button
      className={className}
      onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      aria-label="Toggle theme"
      style={{
        background: 'var(--bg-surface-2)',
        border: '1px solid var(--border)',
        color: 'var(--text-primary)',
        borderRadius: '10px',
        width: '38px',
        height: '38px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '16px',
      }}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}