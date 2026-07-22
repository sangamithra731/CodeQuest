import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home, Swords, Trophy, Award, Briefcase, CheckCircle2, Code2,
  Sun, Moon, Settings, LogOut, Rocket, Star, Lock, Zap,
  Sparkles, Crown, Gem, TrendingUp, Menu, X, Clock
} from 'lucide-react';
import { getAchievements } from '../../services/api';
import RabbitMascot from '../../components/common/RabbitMascot';
import './Achievements.css';

const NAV_ITEMS = [
  { icon: Home, label: 'Home', path: '/dashboard' },
  { icon: Swords, label: 'Quests', path: '/languages' },
  { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
  { icon: Award, label: 'Achievements', path: '/achievements' },
  { icon: Briefcase, label: 'Placement', path: '/placement' },
  { icon: CheckCircle2, label: 'Eligibility', path: '/eligibility' },
  { icon: Code2, label: 'Problems', path: '/problems' },
];

const BADGE_STYLES = ['premium-gold', 'premium-silver', 'premium-bronze', 'premium-platinum', 'premium-diamond'];

function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('cq_theme') || 'dark');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cq_theme', theme);
  }, [theme]);
  return [theme, setTheme];
}

function Badge({ achievement, styleClass, index }) {
  const { id, name, description, unlocked, xpReward, progress, target, rarity = 'common', unlockedAt } = achievement;
  const pct = target ? Math.min(100, Math.round((progress / target) * 100)) : unlocked ? 100 : 0;
  const remaining = target ? Math.max(0, target - progress) : 0;
  const stars = { common: 1, rare: 2, epic: 3, legendary: 4, mythic: 5 }[rarity] || 3;
  
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div 
      className={`badge-card-premium ${styleClass} ${unlocked ? 'is-unlocked' : 'is-locked'}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="badge-glow-ring" />
      <div className="badge-emblem-premium">
        <div className="badge-shield">
          <div className="badge-shield-bg" />
          {unlocked ? (
            <div className="badge-icon-unlocked">
              <Crown size={32} />
            </div>
          ) : (
            <div className="badge-icon-locked">
              <Lock size={28} />
            </div>
          )}
          <div className="badge-stars-premium">
            {Array.from({ length: stars }).map((_, i) => (
              <Star key={i} size={12} fill={unlocked ? 'currentColor' : 'none'} />
            ))}
          </div>
        </div>
      </div>

      <div className={`badge-ribbon-premium ${unlocked ? 'ribbon-unlocked' : 'ribbon-locked'}`}>
        <span>{unlocked ? '✦ UNLOCKED' : '🔒 LOCKED'}</span>
      </div>

      <div className="badge-body-premium">
        <h3 className="badge-name-premium">{name}</h3>
        <p className="badge-desc-premium">{description}</p>

        {!unlocked && target && (
          <>
            <div className="badge-progress-container">
              <div className="badge-progress-track-premium">
                <div className="badge-progress-fill-premium" style={{ width: `${pct}%` }} />
              </div>
              <p className="badge-progress-label-premium">
                <Zap size={11} /> {remaining} XP remaining
              </p>
            </div>
          </>
        )}

        {unlocked && (
          <>
            <div className="badge-reward-premium">
              <div className="badge-reward-badge">
                <Sparkles size={14} />
                <span>+{xpReward} XP</span>
              </div>
            </div>
            {unlockedAt && (
              <div className="badge-unlock-date">
                <Clock size={10} /> Unlocked {formatDate(unlockedAt)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function Achievements() {
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useTheme();
  const [displayName, setDisplayName] = useState('Coder');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [level, setLevel] = useState(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('cq_user');
    const user = stored ? JSON.parse(stored) : null;
    setDisplayName(user?.username || user?.name || 'Coder');

    getAchievements().then((d) => {
      setData(d);
      setLoading(false);
      if (d?.user) {
        setLevel(d.user.level);
      }
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="dash-loading-premium">
        <div className="loading-spinner" />
        <span>Loading achievements...</span>
      </div>
    );
  }

  const achievements = data?.achievements || [];
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const lockedCount = achievements.length - unlockedCount;
  
  const visible = achievements.filter((a) => {
    if (filter === 'unlocked') return a.unlocked;
    if (filter === 'locked') return !a.unlocked;
    return true;
  });

  const totalXp = achievements.reduce((acc, a) => acc + (a.unlocked ? a.xpReward : 0), 0);
  
  // Find next badge (most progressed locked badge)
  const nextBadge = [...achievements]
    .filter((a) => !a.unlocked && a.target)
    .sort((a, b) => (b.progress / b.target) - (a.progress / a.target))[0];
  const nextRemaining = nextBadge ? Math.max(0, nextBadge.target - nextBadge.progress) : 0;

  // Calculate completion percentage
  const completionPercentage = achievements.length > 0 
    ? Math.round((unlockedCount / achievements.length) * 100) 
    : 0;

  return (
    <div className="dash-shell">
      {/* ============== MOBILE NAV TOGGLE ============== */}
      <button 
        className="mobile-nav-toggle"
        onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
        aria-label="Toggle navigation"
      >
        {isMobileNavOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* ============== LEFT SIDEBAR ============== */}
      <aside className={`side-nav ${isMobileNavOpen ? 'open' : ''}`}>
        <div className="side-nav-logo" onClick={() => navigate('/dashboard')}>
          <span className="side-nav-logo-icon"><Rocket size={20} /></span>
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
                onClick={() => navigate(item.path)}
              >
                <Icon size={17} className="side-nav-link-icon" />
                <span>{item.label}</span>
                {item.label === 'Achievements' && (
                  <span className="nav-badge">{unlockedCount}</span>
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
              <RabbitMascot size={32} mood="happy" />
            </span>
            <div className="side-nav-user-meta">
              <span className="side-nav-user-name">{displayName}</span>
              <span className="side-nav-user-level">
                {level ? `LVL ${level}` : ''}{unlockedCount ? ` · ${unlockedCount} badges` : ''}
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
      <div className="dash-content">
        <header className="ach-topbar-premium">
          <div className="topbar-left">
            <div className="topbar-badge-count">
              <Award size={16} />
              <span>{unlockedCount} Badges</span>
            </div>
            <h1 className="topbar-title-premium">🏆 Achievements</h1>
            <p className="topbar-sub-premium">
              {totalXp} XP earned · {completionPercentage}% complete
            </p>
          </div>

          <div className="topbar-right">
            <div className="ach-filters-premium">
              {[
                ['all', 'All', achievements.length],
                ['unlocked', 'Unlocked', unlockedCount],
                ['locked', 'Locked', lockedCount]
              ].map(([key, label, count]) => (
                <button
                  key={key}
                  className={`filter-btn-premium ${filter === key ? 'active' : ''}`}
                  onClick={() => setFilter(key)}
                >
                  {label}
                  <span className="filter-count">{count}</span>
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="ach-main-premium">
          {/* ============== STATS BAR ============== */}
          <div className="stats-bar-premium">
            <div className="stat-card-premium">
              <div className="stat-icon-premium gold">
                <Trophy size={20} />
              </div>
              <div className="stat-info-premium">
                <div className="stat-value-premium">{unlockedCount}</div>
                <div className="stat-label-premium">Badges Unlocked</div>
              </div>
            </div>
            
            <div className="stat-card-premium">
              <div className="stat-icon-premium purple">
                <Star size={20} />
              </div>
              <div className="stat-info-premium">
                <div className="stat-value-premium">{totalXp}</div>
                <div className="stat-label-premium">Total XP Earned</div>
              </div>
            </div>
            
            <div className="stat-card-premium">
              <div className="stat-icon-premium pink">
                <TrendingUp size={20} />
              </div>
              <div className="stat-info-premium">
                <div className="stat-value-premium">{completionPercentage}%</div>
                <div className="stat-label-premium">Completion Rate</div>
              </div>
            </div>
            
            <div className="stat-card-premium">
              <div className="stat-icon-premium teal">
                <Gem size={20} />
              </div>
              <div className="stat-info-premium">
                <div className="stat-value-premium">{achievements.length}</div>
                <div className="stat-label-premium">Total Achievements</div>
              </div>
            </div>
          </div>

          {/* ============== NEXT BADGE BANNER ============== */}
          {nextBadge && (
            <div className="next-badge-premium">
              <div className="next-badge-left">
                <div className="next-badge-icon">
                  <Gem size={24} />
                </div>
                <div className="next-badge-info">
                  <p className="next-badge-kicker">Next Achievement</p>
                  <h2>{nextBadge.name}</h2>
                  <div className="next-badge-progress">
                    <div className="next-badge-track">
                      <div
                        className="next-badge-fill"
                        style={{ width: `${Math.min(100, Math.round((nextBadge.progress / nextBadge.target) * 100))}%` }}
                      />
                    </div>
                    <span className="next-badge-percent">
                      {Math.round((nextBadge.progress / nextBadge.target) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="next-badge-right">
                <div className="xp-remaining">
                  <Zap size={16} />
                  <span>{nextRemaining} XP</span>
                </div>
              </div>
            </div>
          )}

          {/* ============== BADGE GRID ============== */}
          <div className="badge-grid-premium">
            {visible.map((a, i) => (
              <Badge key={a.id} achievement={a} styleClass={BADGE_STYLES[i % BADGE_STYLES.length]} index={i} />
            ))}

            {visible.length === 0 && (
              <div className="empty-state-premium">
                <Trophy size={48} />
                <p>No badges found in this filter</p>
                <span>Keep completing quests to earn more!</span>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}