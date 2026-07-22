import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { COURSE_CATALOG } from '../../data/courseCatalog';
import './Languages.css';

export default function Languages() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('cq_token');
    const userData = localStorage.getItem('cq_user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('cq_token');
    localStorage.removeItem('cq_user');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/login');
  };

  // Smart navigation - if user is logged in go to dashboard, else login
  const handleNavigate = (path) => {
    if (path === '/dashboard' || path === '/') {
      if (isLoggedIn) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    } else {
      navigate(path);
    }
  };

  const filteredCourses = COURSE_CATALOG.filter((course) => {
    const matchesFilter = filter === 'all' || course.difficulty === filter;
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.tagline.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getDifficultyLevel = (difficulty) => {
    const levels = { Beginner: 1, Intermediate: 2, Advanced: 3 };
    return levels[difficulty] || 1;
  };

  return (
    <div className="lang-page">
      {/* Animated Background */}
      <div className="lang-bg">
        <div className="lang-bg-gradient" />
        <div className="lang-bg-particles">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
            }} />
          ))}
        </div>
        <div className="lang-bg-orb orb-1" />
        <div className="lang-bg-orb orb-2" />
        <div className="lang-bg-orb orb-3" />
      </div>

      {/* Navigation */}
      <nav className="lang-nav">
        <button className="lang-nav-home" onClick={() => handleNavigate('/dashboard')}>
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Home</span>
        </button>
        
        <div className="lang-nav-brand" onClick={() => handleNavigate('/dashboard')}>
          <span className="brand-icon">⚡</span>
          <span className="brand-text">CodeQuest</span>
        </div>

        <div className="lang-nav-right">
          {isLoggedIn ? (
            <>
              <button className="lang-nav-profile" onClick={() => navigate('/profile')}>
                <span className="nav-icon">👤</span>
                <span className="nav-label">{user?.name || 'Profile'}</span>
              </button>
              <button className="lang-nav-logout" onClick={handleLogout}>
                <span className="nav-icon">🚪</span>
                <span className="nav-label">Logout</span>
              </button>
            </>
          ) : (
            <>
              <button className="lang-nav-login" onClick={() => navigate('/login')}>
                <span className="nav-icon">🔑</span>
                <span className="nav-label">Login</span>
              </button>
              <button className="lang-nav-signup" onClick={() => navigate('/signup')}>
                <span className="nav-icon">✨</span>
                <span className="nav-label">Sign Up</span>
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Header */}
      <header className="lang-header">
        <div className="lang-header-badge">
          <span className="badge-icon">🚀</span>
          <span className="badge-text">25+ Languages Available</span>
        </div>
        <h1 className="lang-title">
          <span className="title-gradient">Choose Your</span>
          <span className="title-highlight">Adventure</span>
        </h1>
        <p className="lang-subtitle">
          Master new skills, earn achievements, and level up your career
        </p>
        
        {/* Search Bar */}
        <div className="lang-search">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="lang-search-input"
            placeholder="Search languages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="search-clear" onClick={() => setSearchTerm('')}>
              ✕
            </button>
          )}
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="lang-filters">
        <button
          className={`lang-filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          <span className="filter-icon">🎯</span>
          All
          <span className="filter-count">{COURSE_CATALOG.length}</span>
        </button>
        <button
          className={`lang-filter-btn ${filter === 'Beginner' ? 'active' : ''}`}
          onClick={() => setFilter('Beginner')}
        >
          <span className="filter-icon">🌱</span>
          Beginner
          <span className="filter-count">
            {COURSE_CATALOG.filter(c => c.difficulty === 'Beginner').length}
          </span>
        </button>
        <button
          className={`lang-filter-btn ${filter === 'Intermediate' ? 'active' : ''}`}
          onClick={() => setFilter('Intermediate')}
        >
          <span className="filter-icon">⚡</span>
          Intermediate
          <span className="filter-count">
            {COURSE_CATALOG.filter(c => c.difficulty === 'Intermediate').length}
          </span>
        </button>
        <button
          className={`lang-filter-btn ${filter === 'Advanced' ? 'active' : ''}`}
          onClick={() => setFilter('Advanced')}
        >
          <span className="filter-icon">🔥</span>
          Advanced
          <span className="filter-count">
            {COURSE_CATALOG.filter(c => c.difficulty === 'Advanced').length}
          </span>
        </button>
      </div>

      {/* Course Grid */}
      <div className="lang-grid">
        {filteredCourses.map((course, index) => (
          <article
            key={course.id}
            className="lang-card"
            data-difficulty={course.difficulty}
            style={{ 
              '--course-color': course.color,
              animationDelay: `${index * 100}ms`
            }}
            onMouseEnter={() => setHoveredCard(course.id)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => {
              if (isLoggedIn) {
                navigate(`/languages/${course.id}`);
              } else {
                navigate('/login', { state: { from: `/languages/${course.id}` } });
              }
            }}
          >
            <div className="lang-card-glow" />
            
            <div className="lang-card-banner">
              <div className="banner-overlay" />
              {course.image ? (
                <img
                  className="lang-card-banner-img"
                  src={course.image}
                  alt={course.name}
                  loading="lazy"
                />
              ) : (
                <div className="lang-card-icon-fallback">
                  <span className="fallback-icon">{course.icon}</span>
                </div>
              )}
              <div className="lang-card-status">
                {course.full ? (
                  <span className="status-badge available">Available</span>
                ) : (
                  <span className="status-badge soon">Coming Soon</span>
                )}
              </div>
            </div>

            <div className="lang-card-body">
              <div className="lang-card-top">
                <div className="lang-card-header">
                  <span className="lang-card-icon">{course.icon}</span>
                  <h3 className="lang-card-title">{course.name}</h3>
                </div>
                <p className="lang-card-description">{course.tagline}</p>
              </div>

              <div className="lang-card-footer">
                <div className="lang-card-meta">
                  <div className="lang-card-difficulty">
                    <div className="difficulty-bars">
                      {[1, 2, 3].map((level) => (
                        <span 
                          key={level} 
                          className={`difficulty-bar ${level <= getDifficultyLevel(course.difficulty) ? 'active' : ''}`}
                          style={{ 
                            '--bar-color': course.color,
                            height: `${level * 4 + 4}px`
                          }}
                        />
                      ))}
                    </div>
                    <span className="difficulty-label">{course.difficulty}</span>
                  </div>
                  
                  <div className="lang-card-stats">
                    <span className="stat-item">
                      <span className="stat-icon">📚</span>
                      <span className="stat-value">{course.modules || 12}</span>
                    </span>
                    <span className="stat-item">
                      <span className="stat-icon">⭐</span>
                      <span className="stat-value">{course.xpReward || 500}</span>
                    </span>
                  </div>
                </div>

                <button 
                  className={`lang-card-btn ${!course.full ? 'disabled' : ''}`}
                  disabled={!course.full}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isLoggedIn) {
                      navigate('/login', { state: { from: `/languages/${course.id}` } });
                    } else if (course.full) {
                      navigate(`/languages/${course.id}`);
                    }
                  }}
                >
                  {course.full ? (
                    <span className="btn-content">
                      <span>Start Learning</span>
                      <span className="btn-arrow">→</span>
                    </span>
                  ) : (
                    <span className="btn-content">
                      <span>Coming Soon</span>
                      <span className="btn-arrow">⌛</span>
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="lang-card-border" />
          </article>
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="lang-empty">
          <div className="empty-icon">🔍</div>
          <h3>No languages found</h3>
          <p>Try adjusting your search or filter criteria</p>
          <button className="empty-reset" onClick={() => {
            setSearchTerm('');
            setFilter('all');
          }}>
            Reset Filters
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="lang-footer">
        <div className="footer-content">
          <span className="footer-emoji">⚡</span>
          <span>CodeQuest — Learn to code, one quest at a time</span>
          <span className="footer-emoji">🚀</span>
        </div>
      </footer>
    </div>
  );
}