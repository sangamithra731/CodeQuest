// Dashboard.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home, Swords, Trophy, Award, Briefcase, CheckCircle2, Code2,
  Search, Sun, Moon, Settings, LogOut, Flame, Sparkles, ScrollText,
  ChevronRight, Rocket
} from 'lucide-react';
import { getDashboard } from '../../services/api';
import { COURSE_CATALOG } from '../../data/courseCatalog';
import RabbitMascot from '../../components/common/RabbitMascot';
import './Dashboard.css';

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

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [displayName, setDisplayName] = useState('Coder');
  const [theme, setTheme] = useTheme();

  useEffect(() => {
    const stored = localStorage.getItem('cq_user');
    const user = stored ? JSON.parse(stored) : null;
    setDisplayName(user?.username || user?.name || 'Coder');

    getDashboard().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  // Real weekly streak sparkline — derived from data.dailyActivity if the API
  // provides it, otherwise falls back to a flat baseline instead of fake noise.
  const bars = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data.dailyActivity) && data.dailyActivity.length) {
      const max = Math.max(...data.dailyActivity, 1);
      return data.dailyActivity.map((v) => Math.max(6, Math.round((v / max) * 100)));
    }
    // No activity history from the API yet — show an honest empty state, not invented data.
    return null;
  }, [data]);

  if (loading) {
    return (
      <div className="dash-loading">
        <span className="dash-loading-blip">▮▮▮</span>
        LOADING QUEST LOG…
      </div>
    );
  }

  const xpPct = Math.min(100, Math.round((data.xpIntoLevel / data.xpForNextLevel) * 100));

  const overallPct = (() => {
    const langs = Object.values(data.courseProgress || {});
    if (!langs.length) return 0;
    const totalDone = langs.reduce((s, l) => s + l.completedLevels, 0);
    const totalAll = langs.reduce((s, l) => s + l.totalLevels, 0);
    return totalAll ? Math.round((totalDone / totalAll) * 100) : 0;
  })();

  const continueCourse = COURSE_CATALOG.find((c) => {
    const p = data.courseProgress[c.id];
    return c.full && p && p.completedLevels > 0 && p.completedLevels < p.totalLevels;
  });
  const continuePct = continueCourse
    ? Math.round(
        (data.courseProgress[continueCourse.id].completedLevels /
          data.courseProgress[continueCourse.id].totalLevels) *
          100
      )
    : 0;
  const continueLevel = continueCourse ? data.courseProgress[continueCourse.id].completedLevels : 0;
  const continueTotalLevels = continueCourse ? data.courseProgress[continueCourse.id].totalLevels : 0;

  // "Up next" — a real recommendation instead of a filler panel: the first
  // full course the learner hasn't started yet.
  const upNextCourse = COURSE_CATALOG.find((c) => {
    const p = data.courseProgress[c.id];
    return c.full && (!p || p.completedLevels === 0) && c.id !== continueCourse?.id;
  });

  const visibleCourses = COURSE_CATALOG.filter((c) => {
    const matchesFilter = filter === 'all' || c.difficulty === filter;
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="dash-shell">
      {/* ============== LEFT SIDEBAR ============== */}
      <aside className="side-nav">
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

          <div className="side-nav-user" onClick={() => navigate('/settings')}>
            <span className="side-nav-user-avatar">
              <RabbitMascot size={32} mood="happy" />
            </span>
            <div className="side-nav-user-meta">
              <span className="side-nav-user-name">{displayName}</span>
              <span className="side-nav-user-level">LVL {data.level} · {xpPct}% to next</span>
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
        <header className="dash-topbar">
          <div>
            <h1 className="dash-topbar-title">Welcome back, {displayName}</h1>
            <p className="dash-topbar-sub">{overallPct}% of your quests cleared overall</p>
          </div>
          <div className="dash-search">
            <Search size={14} className="dash-search-icon" />
            <input
              type="text"
              placeholder="Search quests…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        <main className="dash-main">
          <div className="dash-center">

            {/* Hero row: streak / continue quest / up next */}
            <section className="hero-row">
              <div className="hero-card streak-card">
                <p className="hero-card-label"><Flame size={13} /> Current streak</p>
                <h2 className="streak-big-number">{data.streak}<span>d</span></h2>
                {bars ? (
                  <div className="streak-bars">
                    {bars.map((h, i) => (
                      <div key={i} className="streak-bar" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                ) : (
                  <p className="streak-empty">Clear a level today to start your activity chart.</p>
                )}
                <p className="streak-sub">{data.badges.length} badges · {data.certificates.length} certificates</p>
              </div>

              {continueCourse ? (
                <div
                  className="hero-card continue-banner"
                  style={{ '--course-color': continueCourse.color }}
                  onClick={() => navigate(`/languages/${continueCourse.id}`)}
                >
                  {continueCourse.image && (
                    <img className="continue-banner-img" src={continueCourse.image} alt={continueCourse.name} />
                  )}
                  <div className="continue-banner-overlay" />
                  <div className="continue-banner-body">
                    <p className="continue-banner-kicker">Continue your quest</p>
                    <h2>{continueCourse.name}</h2>

                    <div className="continue-banner-steps">
                      {Array.from({ length: Math.min(5, continueTotalLevels || 5) }).map((_, i) => {
                        const stepLevel = Math.round(((i + 1) / Math.min(5, continueTotalLevels || 5)) * continueTotalLevels);
                        const done = continueLevel >= stepLevel;
                        return (
                          <span key={i} className={`continue-step ${done ? 'done' : ''}`}>
                            Lv {stepLevel}
                          </span>
                        );
                      })}
                    </div>

                    <div className="continue-banner-track">
                      <div className="continue-banner-fill" style={{ width: `${continuePct}%` }} />
                    </div>
                    <button className="continue-banner-btn">Resume — {continuePct}%</button>
                  </div>
                </div>
              ) : (
                <div className="hero-card continue-banner continue-banner-empty">
                  <div className="continue-banner-body">
                    <p className="continue-banner-kicker">No quest in progress</p>
                    <h2>Pick one from the grid below</h2>
                  </div>
                </div>
              )}

              <div className="hero-card upnext-card">
                <p className="hero-card-label"><Sparkles size={13} /> Up next</p>
                {upNextCourse ? (
                  <>
                    <div className="upnext-icon" style={{ background: upNextCourse.color }}>
                      {upNextCourse.image
                        ? <img src={upNextCourse.image} alt={upNextCourse.name} />
                        : <Code2 size={22} />}
                    </div>
                    <h3 className="upnext-name">{upNextCourse.name}</h3>
                    <p className="upnext-tagline">{upNextCourse.tagline}</p>
                    <button className="upnext-btn" onClick={() => navigate(`/languages/${upNextCourse.id}`)}>
                      Start quest
                    </button>
                  </>
                ) : (
                  <p className="upnext-empty">You've started every available quest. Nice work.</p>
                )}
              </div>
            </section>

            {/* Milestone pills — only real, earned milestones */}
            <section className="milestone-row">
              <span className="milestone-pill pill-teal"><Flame size={12} /> {data.streak}d streak</span>
              <span className="milestone-pill pill-pink"><Trophy size={12} /> Level {data.level}</span>
              {data.badges.slice(0, 3).map((b, i) => (
                <span key={i} className={`milestone-pill pill-${['yellow', 'purple', 'teal'][i % 3]}`}>
                  <Award size={12} /> {typeof b === 'string' ? b : b.name}
                </span>
              ))}
              {data.badges.length === 0 && (
                <span className="milestone-pill pill-muted">No badges earned yet</span>
              )}
            </section>

            {/* Stat cards */}
            <section className="stat-cards-row">
              <div className="stat-card stat-teal">
                <span className="stat-card-icon"><Sparkles size={18} /></span>
                <div>
                  <p className="stat-card-value">{data.xpIntoLevel + (data.level - 1) * data.xpForNextLevel}</p>
                  <p className="stat-card-label">Total XP</p>
                </div>
              </div>
              <div className="stat-card stat-blue">
                <span className="stat-card-icon"><Award size={18} /></span>
                <div>
                  <p className="stat-card-value">{data.badges.length}</p>
                  <p className="stat-card-label">Badges earned</p>
                </div>
              </div>
              <div className="stat-card stat-purple">
                <span className="stat-card-icon"><ScrollText size={18} /></span>
                <div>
                  <p className="stat-card-value">{data.certificates.length}</p>
                  <p className="stat-card-label">Certificates</p>
                </div>
              </div>
            </section>

            {/* Quest grid */}
            <section className="quest-section">
              <div className="quest-head">
                <h2>All quests</h2>
                <div className="quest-filters">
                  {['all', 'Beginner', 'Intermediate', 'Advanced'].map((f) => (
                    <button
                      key={f}
                      className={`quest-filter-btn ${filter === f ? 'active' : ''}`}
                      onClick={() => setFilter(f)}
                    >
                      {f === 'all' ? 'All' : f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="quest-grid">
                {visibleCourses.map((course) => {
                  const prog = data.courseProgress[course.id];
                  const pct = prog ? Math.round((prog.completedLevels / prog.totalLevels) * 100) : 0;
                  const started = !!prog && prog.completedLevels > 0;
                  const cleared = course.full && pct >= 100;

                  return (
                    <article
                      key={course.id}
                      className="quest-card"
                      style={{ '--course-color': course.color }}
                      onClick={() => navigate(`/languages/${course.id}`)}
                    >
                      {cleared && <span className="quest-card-cleared">CLEARED</span>}

                      <div className="quest-card-banner">
                        {course.image ? (
                          <img className="quest-card-banner-img" src={course.image} alt={course.name} />
                        ) : (
                          <span className="quest-card-icon-fallback"><Code2 size={26} /></span>
                        )}
                        <span className="quest-card-diff-tag">{course.difficulty}</span>
                      </div>

                      <div className="quest-card-body">
                        <h3>{course.name}</h3>
                        <p>{course.tagline}</p>

                        {!course.full && <span className="quest-card-soon">In development</span>}

                        {course.full && (
                          <>
                            <div className="quest-card-hp-wrap">
                              <div className="quest-card-hp-track">
                                <div className="quest-card-hp-fill" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="quest-card-hp-pct">{pct}%</span>
                            </div>
                            <button className="quest-card-btn">{started ? 'Continue' : 'Start'}</button>
                          </>
                        )}
                      </div>
                    </article>
                  );
                })}

                {visibleCourses.length === 0 && (
                  <p className="quest-empty">No quests match "{search}".</p>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}