// src/components/common/Sidebar.jsx

import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home, Swords, Trophy, Award, Briefcase, CheckCircle2, Code2,
  Settings, LogOut, Sun, Moon, Rocket, ChevronRight, Menu, X
} from 'lucide-react';
import RabbitMascot from './RabbitMascot';
import './Sidebar.css';

const NAV_ITEMS = [
  { icon: Home, label: 'Home', path: '/dashboard' },
  { icon: Swords, label: 'Quests', path: '/languages' },
  { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
  { icon: Award, label: 'Achievements', path: '/achievements' },
  { icon: Briefcase, label: 'Placement', path: '/placement' },
  { icon: CheckCircle2, label: 'Eligibility', path: '/eligibility' },
  { icon: Code2, label: 'Problems', path: '/problems' },
];

function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('cq_theme') || 'dark');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cq_theme', theme);
  }, [theme]);
  return [theme, setTheme];
}

export default function Sidebar({ userData, onClose, isMobile, className }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useTheme();
  const [displayName, setDisplayName] = useState('Coder');
  const [userLevel, setUserLevel] = useState(1);
  const [xpPct, setXpPct] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('cq_user');
    const user = stored ? JSON.parse(stored) : null;
    setDisplayName(user?.username || user?.name || 'Coder');

    if (userData) {
      setUserLevel(userData.level || 1);
      const xpInto = userData.xpIntoLevel || 0;
      const xpForNext = userData.xpForNextLevel || 100;
      setXpPct(Math.min(100, Math.round((xpInto / xpForNext) * 100)));
    }
  }, [userData]);

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <aside className={`side-nav ${isMobile ? 'side-nav-mobile' : ''} ${className || ''}`}>
      <div className="side-nav-logo" onClick={() => handleNavigation('/dashboard')}>
        <span className="side-nav-logo-icon">
          <Rocket size={20} />
        </span>
        <span className="side-nav-logo-text">CodeQuest</span>
      </div>

      <nav className="side-nav-links">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <button
              key={item.label}
              className={`side-nav-link ${active ? 'active' : ''}`}
              onClick={() => handleNavigation(item.path)}
            >
              <Icon size={17} className="side-nav-link-icon" />
              <span>{item.label}</span>
              {active && <ChevronRight size={14} className="side-nav-link-chevron" />}
            </button>
          );
        })}
      </nav>

      <div className="side-nav-footer">
        <button
          className="side-nav-theme-btn"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
        </button>

        <div className="side-nav-user" onClick={() => handleNavigation('/settings')}>
          <span className="side-nav-user-avatar">
            <RabbitMascot size={32} mood="happy" />
          </span>
          <div className="side-nav-user-meta">
            <span className="side-nav-user-name">{displayName}</span>
            <span className="side-nav-user-level">
              LVL {userLevel} · {xpPct}% to next
            </span>
          </div>
          <Settings size={15} className="side-nav-user-settings" />
        </div>

        <button className="side-nav-logout" onClick={() => handleNavigation('/logout')}>
          <LogOut size={15} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}