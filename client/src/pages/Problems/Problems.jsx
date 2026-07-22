// Problems.jsx - Complete with Sidebar Integration
import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  Home, Swords, Trophy, Award, Briefcase, CheckCircle2, Code2,
  Sun, Moon, Settings, LogOut, Rocket, Menu, X
} from 'lucide-react';
import { PlatformPicker } from './PlatformPicker';
import { ProblemList } from './ProblemList';
import { ProblemDetail } from './ProblemDetail';
import { ProblemStats } from './ProblemStats';
import './Problems.css';

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

export function Problems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useTheme();
  const [displayName, setDisplayName] = useState('Coder');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [problemCount, setProblemCount] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('cq_user');
    const user = stored ? JSON.parse(stored) : null;
    setDisplayName(user?.username || user?.name || 'Coder');

    // Close mobile nav on route change
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  // Get the current route to determine which component to render
  const isStatsPage = location.pathname === '/problems/stats';
  const isDetailPage = location.pathname.includes('/problems/') && 
                       !location.pathname.includes('/stats') && 
                       location.pathname.split('/').length > 3;

  return (
    <div className="problems-page-wrapper">
      {/* ============== MOBILE NAV TOGGLE ============== */}
      <button 
        className="side-nav-hamburger"
        onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
        aria-label="Toggle navigation"
      >
        {isMobileNavOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isMobileNavOpen && (
        <div className="side-nav-overlay" onClick={() => setIsMobileNavOpen(false)} />
      )}

      {/* ============== LEFT SIDEBAR ============== */}
      <aside className={`side-nav ${isMobileNavOpen ? 'open' : ''}`}>
        <div className="side-nav-logo" onClick={() => navigate('/dashboard')}>
          <span className="side-nav-logo-icon"><Rocket size={20} /></span>
          <span className="side-nav-logo-text">CodeQuest</span>
        </div>

        <nav className="side-nav-links">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path || 
                          (item.path === '/problems' && location.pathname.startsWith('/problems'));
            return (
              <button
                key={item.label}
                className={`side-nav-link ${active ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <Icon size={17} className="side-nav-link-icon" />
                <span>{item.label}</span>
                {item.label === 'Problems' && problemCount > 0 && (
                  <span className="nav-badge">{problemCount}</span>
                )}
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

          <div className="side-nav-user" onClick={() => navigate('/settings')}>
            <span className="side-nav-user-avatar">
              <div className="problems-user-avatar">
                <span>{displayName.charAt(0).toUpperCase()}</span>
              </div>
            </span>
            <div className="side-nav-user-meta">
              <span className="side-nav-user-name">{displayName}</span>
              <span className="side-nav-user-level">
                {isStatsPage ? '📊 Stats' : isDetailPage ? '📝 Solving' : '💻 Problems'}
              </span>
            </div>
            <Settings size={15} className="side-nav-user-settings" />
          </div>

          <button className="side-nav-logout" onClick={() => navigate('/logout')}>
            <LogOut size={15} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* ============== MAIN CONTENT ============== */}
      <div className="problems-page">
        <Routes>
          <Route path="/" element={<PlatformPicker setProblemCount={setProblemCount} />} />
          <Route path="/:platform" element={<ProblemList />} />
          <Route path="/:platform/:slug" element={<ProblemDetail />} />
          <Route path="/stats" element={<ProblemStats />} />
        </Routes>
      </div>
    </div>
  );
}