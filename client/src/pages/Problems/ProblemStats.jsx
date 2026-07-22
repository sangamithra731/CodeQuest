// ProblemStats.jsx - New component for tracking progress
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import './Problems.css';

export function ProblemStats() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/problems/stats')
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="problem-loading-container">
        <div className="spinner"></div>
        <p>Loading stats…</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="problem-error-container">
        <p>Failed to load statistics</p>
      </div>
    );
  }

  return (
    <div className="problem-list-page">
      <header className="placement-header">
        <button className="placement-back" onClick={() => navigate('/problems')}>
          ← Back to platforms
        </button>
        <h1>Your Progress</h1>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Problems</h3>
          <div className="stat-number">{stats.total}</div>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <div className="stat-number">{stats.completed}</div>
          <div className="stat-sub">{Math.round((stats.completed / stats.total) * 100)}%</div>
        </div>
        <div className="stat-card">
          <h3>By Difficulty</h3>
          <div className="stat-bars">
            <div className="stat-bar">
              <span>Easy</span>
              <div className="bar-container">
                <div className="bar-fill easy" style={{ width: `${stats.byDifficulty.easy}%` }}></div>
              </div>
              <span>{stats.byDifficulty.easy}</span>
            </div>
            <div className="stat-bar">
              <span>Medium</span>
              <div className="bar-container">
                <div className="bar-fill medium" style={{ width: `${stats.byDifficulty.medium}%` }}></div>
              </div>
              <span>{stats.byDifficulty.medium}</span>
            </div>
            <div className="stat-bar">
              <span>Hard</span>
              <div className="bar-container">
                <div className="bar-fill hard" style={{ width: `${stats.byDifficulty.hard}%` }}></div>
              </div>
              <span>{stats.byDifficulty.hard}</span>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <h3>Recent Activity</h3>
          <div className="recent-activity">
            {stats.recentActivity?.map((activity, idx) => (
              <div key={idx} className="activity-item">
                <span>{activity.problem}</span>
                <span className="activity-time">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}