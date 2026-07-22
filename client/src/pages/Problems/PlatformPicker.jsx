import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { EXTERNAL_PLATFORMS, stars } from '../../data/externalPlatforms';
import './Problems.css';

const PLATFORM_SLUGS = {
  LeetCode: 'leetcode', 
  HackerRank: 'hackerrank', 
  CodeChef: 'codechef', 
  Codeforces: 'codeforces',
  GeeksforGeeks: 'geeksforgeeks', 
  'Coding Ninjas': 'codingninjas', 
  Exercism: 'exercism',
  Codewars: 'codewars', 
  HackerEarth: 'hackerearth', 
  AtCoder: 'atcoder', 
  Topcoder: 'topcoder',
  SPOJ: 'spoj', 
  'Project Euler': 'projecteuler', 
  CodingBat: 'codingbat', 
  CodinGame: 'codingame',
};

export function PlatformPicker() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  const filteredPlatforms = useMemo(() => {
    return EXTERNAL_PLATFORMS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           p.bestFor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = difficultyFilter === 'all' || p.difficulty === difficultyFilter;
      return matchesSearch && matchesDifficulty;
    });
  }, [searchTerm, difficultyFilter]);

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Beginner': 'var(--accent-green)',
      'Intermediate': 'var(--accent-gold)',
      'Advanced': 'var(--accent-red)',
      'Expert': 'var(--accent-purple)'
    };
    return colors[difficulty] || 'var(--text-secondary)';
  };

  return (
    <div className="problem-list-page">
      <header className="placement-header">
        <div className="header-content">
          <div>
            <h1>Coding Practice</h1>
            <p>Pick a platform style to practice in — each has its own problem set.</p>
          </div>
          <button 
            className="stats-btn"
            onClick={() => navigate('/problems/stats')}
          >
            📊 View Stats
          </button>
        </div>
        
        <div className="filter-bar">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="🔍 Search platforms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-group">
            <select 
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
        </div>
      </header>

      <div className="platform-grid">
        {filteredPlatforms.length === 0 ? (
          <div className="no-results">
            <p>No platforms match your search criteria</p>
          </div>
        ) : (
          filteredPlatforms.map((p) => (
            <div 
              key={p.name} 
              className="platform-card"
              onClick={() => navigate(`/problems/${PLATFORM_SLUGS[p.name]}`)}
            >
              <div className="platform-card-header">
                <h3>{p.name}</h3>
                <span className="platform-problems-count">
                  {p.problemCount || 'Coming soon'}
                </span>
              </div>
              <p className="platform-best-for">{p.bestFor}</p>
              <div className="platform-footer">
                <span className="platform-difficulty" style={{ color: getDifficultyColor(p.difficulty) }}>
                  {stars(p.difficulty)}
                </span>
                <span className="platform-arrow">→</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="platform-stats">
        <div className="stat-item">
          <span className="stat-label">Total Platforms</span>
          <span className="stat-value">{EXTERNAL_PLATFORMS.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Beginner Friendly</span>
          <span className="stat-value">
            {EXTERNAL_PLATFORMS.filter(p => p.difficulty === 'Beginner').length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Advanced</span>
          <span className="stat-value">
            {EXTERNAL_PLATFORMS.filter(p => p.difficulty === 'Advanced' || p.difficulty === 'Expert').length}
          </span>
        </div>
      </div>
    </div>
  );
}