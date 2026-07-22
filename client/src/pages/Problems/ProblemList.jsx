import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';
import './Problems.css';

export function ProblemList() {
  const navigate = useNavigate();
  const { platform } = useParams();
  const [problems, setProblems] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [sortBy, setSortBy] = useState('title');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/api/problems/platforms/${platform}`),
      api.get('/api/problems/completions').catch(() => ({ data: { completed: [] } }))
    ])
      .then(([problemsRes, completionsRes]) => {
        setProblems(problemsRes.data.problems);
        setCompleted(completionsRes.data.completed || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [platform]);

  const filteredAndSortedProblems = useMemo(() => {
    if (!problems) return [];

    let filtered = problems.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           p.topic.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = difficultyFilter === 'all' || p.difficulty === difficultyFilter;
      return matchesSearch && matchesDifficulty;
    });

    const sortFunctions = {
      title: (a, b) => a.title.localeCompare(b.title),
      difficulty: (a, b) => {
        const order = { Easy: 1, Medium: 2, Hard: 3 };
        return order[a.difficulty] - order[b.difficulty];
      },
      status: (a, b) => {
        const aCompleted = completed.includes(a.id) ? 1 : 0;
        const bCompleted = completed.includes(b.id) ? 1 : 0;
        return bCompleted - aCompleted;
      },
      topic: (a, b) => a.topic.localeCompare(b.topic)
    };

    return filtered.sort(sortFunctions[sortBy] || sortFunctions.title);
  }, [problems, searchTerm, difficultyFilter, sortBy, completed]);

  if (loading) {
    return (
      <div className="problem-loading-container">
        <div className="spinner"></div>
        <p>Loading problems…</p>
      </div>
    );
  }

  if (!problems) {
    return (
      <div className="problem-error-container">
        <p>Failed to load problems. Please try again.</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  const completionRate = problems.length > 0 
    ? Math.round((completed.filter(id => problems.some(p => p.id === id)).length / problems.length) * 100)
    : 0;

  return (
    <div className="problem-list-page">
      <header className="placement-header">
        <div className="header-content">
          <div className="header-left">
            <button className="placement-back" onClick={() => navigate('/problems')}>
              ← All platforms
            </button>
            <h1 style={{ marginTop: 12 }}>{platform} Problems</h1>
          </div>
          <div className="header-right">
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
              <span className="progress-text">{completionRate}% completed</span>
            </div>
          </div>
        </div>
        <p>{problems.length} problems in this set</p>
      </header>

      <div className="problem-controls">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="🔍 Search problems..."
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
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="title">Sort by Title</option>
            <option value="difficulty">Sort by Difficulty</option>
            <option value="status">Sort by Status</option>
            <option value="topic">Sort by Topic</option>
          </select>
        </div>
      </div>

      {filteredAndSortedProblems.length === 0 ? (
        <div className="no-results">
          <p>No problems match your filters</p>
        </div>
      ) : (
        <table className="problem-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Title</th>
              <th>Topic</th>
              <th>Difficulty</th>
              <th>Video</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedProblems.map((p) => (
              <tr key={p.id}>
                <td>{completed.includes(p.id) ? '✅' : '⬜'}</td>
                <td 
                  className="problem-title"
                  onClick={() => navigate(`/problems/${platform}/${p.slug}`)}
                >
                  {p.title}
                </td>
                <td>
                  <span className="topic-tag">{p.topic}</span>
                </td>
                <td>
                  <span className={`diff-tag diff-${p.difficulty.toLowerCase()}`}>
                    {p.difficulty}
                  </span>
                </td>
                <td>{p.videoUrl ? '🎬' : '—'}</td>
                <td>
                  <button 
                    className="view-btn"
                    onClick={() => navigate(`/problems/${platform}/${p.slug}`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}