// src/pages/Leaderboard/Leaderboard.jsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy, Flame, Zap, Rocket, Home, Swords, Award,
  Briefcase, CheckCircle2, Code2, Settings, LogOut,
  Crown, Users, TrendingUp, Menu, X
} from 'lucide-react';
import { getLeaderboard, getUserProfile } from '../../services/api';
import Sidebar from '../../components/common/Sidebar';
import RabbitMascot from '../../components/common/RabbitMascot';
import './Leaderboard.css';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import OfflineNotice from '../../components/common/OfflineNotice';

const RANK_COLORS = ['#ffd23f', '#c9cfee', '#ff9f5a'];
const RANK_EMOJIS = ['👑', '🥈', '🥉'];

export default function Leaderboard() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [range, setRange] = useState('all');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const online = useOnlineStatus();
  useEffect(() => {
    const stored = localStorage.getItem('cq_user');
    const user = stored ? JSON.parse(stored) : null;
    const userId = user?.id || user?._id || null;
    setCurrentUserId(userId);

    if (userId) {
      getUserProfile(userId)
        .then(data => setCurrentUserData(data))
        .catch(err => {
          console.error('Error fetching user profile:', err);
          // Use mock data if API fails
          setCurrentUserData({
            id: userId,
            username: user?.username || 'Coder',
            level: 5,
            xp: 2500
          });
        });
    }

    // Fetch leaderboard
    getLeaderboard(range)
      .then((data) => {
        const sorted = [...(data || [])].sort((a, b) => b.xp - a.xp);
        setRows(sorted);
        setLoading(false);
      })
      .catch(() => {
        // Use mock data if API fails
        const mockData = [
          { id: '1', username: 'CodeNinja', level: 15, xp: 15000, streak: 45 },
          { id: '2', username: 'ByteMaster', level: 12, xp: 12000, streak: 30 },
          { id: '3', username: 'DataWizard', level: 10, xp: 9500, streak: 25 },
          { id: '4', username: 'AlgoPro', level: 9, xp: 8500, streak: 20 },
          { id: '5', username: 'CodeMaster', level: 8, xp: 7200, streak: 18 },
          { id: '6', username: 'TechGuru', level: 7, xp: 6500, streak: 15 },
          { id: '7', username: 'CodingSamurai', level: 6, xp: 5200, streak: 12 },
          { id: '8', username: 'DevExpert', level: 5, xp: 4500, streak: 10 },
          { id: '9', username: 'ScriptKiddie', level: 4, xp: 3200, streak: 8 },
          { id: '10', username: 'BugHunter', level: 3, xp: 2100, streak: 5 }
        ];
        setRows(mockData);
        setLoading(false);
        setError(false);
      });
  }, [range]);

  const maxXp = rows.length ? Math.max(...rows.map(r => r.xp || 0), 1) : 1;
  const totalPlayers = rows.length;
  const totalXP = rows.reduce((sum, p) => sum + (p.xp || 0), 0);
  const averageXP = totalPlayers > 0 ? Math.round(totalXP / totalPlayers) : 0;

  const getRankClass = (rank) => {
    if (rank === 1) return 'is-top is-top-1';
    if (rank === 2) return 'is-top is-top-2';
    if (rank === 3) return 'is-top is-top-3';
    return '';
  };

  const getProgressColor = (rank) => {
    if (rank === 1) return 'top-1';
    if (rank === 2) return 'top-2';
    if (rank === 3) return 'top-3';
    return '';
  };

  const getUserInitials = (username) => {
    if (!username) return '?';
    const parts = username.split(' ');
    if (parts.length > 1) {
      return parts[0][0] + parts[1][0];
    }
    return username.slice(0, 2).toUpperCase();
  };
  if (!online) {
  return (
    <div className="dash-shell">
      <Sidebar
        userData={currentUserData}
        isMobile={true}
        onClose={() => setMobileMenuOpen(false)}
        className={mobileMenuOpen ? 'open' : ''}
      />

      <div className="dash-content">
        <main className="dash-main">
          <OfflineNotice label="Leaderboard" />
        </main>
      </div>
    </div>
  );
}

  return (
    <div className="dash-shell">
      {/* Mobile Hamburger */}
      <button 
        className="side-nav-hamburger"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {mobileMenuOpen && (
        <div className="side-nav-overlay" onClick={() => setMobileMenuOpen(false)} />
      )}

      <Sidebar 
        userData={currentUserData} 
        isMobile={true}
        onClose={() => setMobileMenuOpen(false)}
        className={mobileMenuOpen ? 'open' : ''}
      />

      <div className="dash-content">
        {/* Topbar */}
        <header className="lb-topbar">
          <div>
            <p className="lb-topbar-eyebrow">
              <Trophy size={14} /> Leaderboard
            </p>
            <h1 className="lb-topbar-title">Global Rankings</h1>
            <div className="lb-topbar-stats">
              <span className="lb-topbar-stat">
                <Users size={14} />
                <strong>{totalPlayers}</strong> players
              </span>
              <span className="lb-topbar-stat">
                <Zap size={14} />
                <strong>{totalXP.toLocaleString()}</strong> total XP
              </span>
              <span className="lb-topbar-stat">
                <TrendingUp size={14} />
                <strong>{averageXP.toLocaleString()}</strong> avg XP
              </span>
            </div>
          </div>
          <div className="lb-range-tabs">
            {[
              ['week', 'This Week'],
              ['month', 'This Month'],
              ['all', 'All Time']
            ].map(([key, label]) => (
              <button
                key={key}
                className={`lb-range-tab ${range === key ? 'active' : ''}`}
                onClick={() => setRange(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </header>

        <main className="lb-main">
          {loading && (
            <div className="lb-loading">
              <div className="lb-loading-spinner" />
              <span className="lb-loading-text">Loading rankings…</span>
            </div>
          )}

          {!loading && error && (
            <div className="lb-empty">
              <div className="lb-empty-icon">⚠️</div>
              <div className="lb-empty-title">Couldn't load the leaderboard</div>
              <div className="lb-empty-sub">Please try again later</div>
            </div>
          )}

          {!loading && !error && rows.length === 0 && (
            <div className="lb-empty">
              <div className="lb-empty-icon">🏆</div>
              <div className="lb-empty-title">No ranked players yet</div>
              <div className="lb-empty-sub">Complete your first quest to appear here!</div>
            </div>
          )}

          {!loading && !error && rows.length > 0 && (
            <div className="lb-table-card">
              <div className="lb-table-head">
                <span>Rank</span>
                <span>Player</span>
                <span className="lb-th-level">Level</span>
                <span className="lb-th-progress">Progress</span>
                <span className="lb-th-total">Total XP</span>
              </div>
              

              <div className="lb-table-body">
                {rows.map((player, idx) => {
                  const rank = idx + 1;
                  const isYou = currentUserId && player.id === currentUserId;
                  const pct = Math.max(4, Math.round(((player.xp || 0) / maxXp) * 100));
                  const isTop = rank <= 3;
                  const rankClass = getRankClass(rank);
                  const progressClass = getProgressColor(rank);
                  const initials = getUserInitials(player.username);
                  

                  return (
                    <div
                      key={player.id || idx}
                      className={`lb-row ${isYou ? 'is-you' : ''} ${rankClass}`}
                      style={{ animationDelay: `${idx * 0.03}s` }}
                    >
                      <span className="lb-col-rank">
                        {isTop ? RANK_EMOJIS[rank - 1] : String(rank).padStart(2, '0')}
                      </span>

                      <span className="lb-col-player">
                        <span className="lb-row-avatar">
                          <div className="lb-avatar-placeholder" style={{
                            background: `hsl(${(idx * 37) % 360}, 70%, 50%)`
                          }}>
                            {initials}
                          </div>
                        </span>
                        <span className="lb-name-block">
                          <span className="lb-name">
                            <span className="lb-name-text">{player.username}</span>
                            {isTop && (
                              <span className="lb-rank-badge">
                                {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'} Top {rank}
                              </span>
                            )}
                            {isYou && <span className="lb-you-tag">YOU</span>}
                          </span>
                          <span className="lb-player-meta">
                            <span className="lb-meta-item">
                              <Flame size={10} className="flame-icon" />
                              {player.streak || 0}d streak
                            </span>
                          </span>
                        </span>
                      </span>
                      

                      <span className="lb-col-level">
                        <span className="level-badge">
                          <span className="level-number">Lv.{player.level || 1}</span>
                        </span>
                      </span>

                      <span className="lb-col-progress">
                        <div className="lb-progress-wrapper">
                          <span className="lb-progress-track">
                            <span
                              className={`lb-progress-fill ${progressClass}`}
                              style={{ width: `${pct}%` }}
                            />
                          </span>
                          <span className="lb-progress-label">{pct}%</span>
                        </div>
                      </span>

                      <span className="lb-col-total">
                        <Zap size={14} className="lb-col-total-icon" />
                        {(player.xp || 0).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}