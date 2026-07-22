// EligibilityStatus.jsx - Complete Reimagined Version

import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2, XCircle, AlertCircle, Award, TrendingUp,
  Clock, Users, Target, Zap, Star, Medal, Shield,
  Rocket, BookOpen, Brain, Sparkles, ChevronRight,
  Activity, BarChart3, Flame, ThumbsUp, Crown,
  GraduationCap, GitBranch, Code, Coffee, Heart,
  Compass, Mountain, Sun, Moon, PartyPopper,
  Menu, X
} from 'lucide-react';
import { api } from '../../services/api';
import Sidebar from '../../components/common/Sidebar';
import RabbitMascot from '../../components/common/RabbitMascot';
import './EligibilityStatus.css';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import OfflineNotice from '../../components/common/OfflineNotice';

// Enhanced mock data with more meaningful content
const MOCK_ELIGIBILITY_DATA = {
  status: 'In Progress',
  overallProgress: 68,
  passedCount: 7,
  total: 11,
  categories: [
    { name: 'Technical Skills', progress: 80, icon: 'Code' },
    { name: 'Project Portfolio', progress: 45, icon: 'Rocket' },
    { name: 'Community Engagement', progress: 90, icon: 'Users' },
    { name: 'Learning Consistency', progress: 60, icon: 'Flame' },
    { name: 'Certifications', progress: 70, icon: 'Medal' }
  ],
  checks: [
    {
      id: 'core_algorithms',
      label: 'Core Algorithms',
      description: 'Master fundamental algorithms including sorting, searching, and dynamic programming',
      required: 'Complete 10 algorithm challenges',
      actual: '8 completed',
      passed: false,
      suggestion: 'Try the "Advanced Sorting" challenge module',
      category: 'Technical Skills',
      icon: 'Brain',
      difficulty: 'Hard'
    },
    {
      id: 'data_structures',
      label: 'Data Structures Mastery',
      description: 'Demonstrate proficiency in arrays, trees, graphs, and hash maps',
      required: 'Solve 15 data structure problems',
      actual: '15 solved',
      passed: true,
      suggestion: '',
      category: 'Technical Skills',
      icon: 'GitBranch',
      difficulty: 'Medium'
    },
    {
      id: 'project_build',
      label: 'Portfolio Project',
      description: 'Build and deploy a full-stack application with proper documentation',
      required: '1 complete project with 3+ features',
      actual: 'Project in development',
      passed: false,
      suggestion: 'Focus on completing the authentication system',
      category: 'Project Portfolio',
      icon: 'Rocket',
      difficulty: 'Hard'
    },
    {
      id: 'code_reviews',
      label: 'Code Review Contributions',
      description: 'Provide constructive feedback on peer submissions to build community',
      required: 'Review 8 peer projects',
      actual: '8 reviews done',
      passed: true,
      suggestion: '',
      category: 'Community Engagement',
      icon: 'Users',
      difficulty: 'Easy'
    },
    {
      id: 'daily_streak',
      label: 'Coding Streak',
      description: 'Maintain consistent daily practice to build momentum',
      required: '45 day streak',
      actual: '38 days',
      passed: false,
      suggestion: 'You\'re almost there! 7 more days to hit the target',
      category: 'Learning Consistency',
      icon: 'Flame',
      difficulty: 'Medium'
    },
    {
      id: 'certificates_earned',
      label: 'Professional Certifications',
      description: 'Earn industry-recognized certifications in your field',
      required: '3 certifications',
      actual: '2 certifications',
      passed: false,
      suggestion: 'Consider the "Advanced JavaScript" certification next',
      category: 'Certifications',
      icon: 'Medal',
      difficulty: 'Hard'
    },
    {
      id: 'problem_solving',
      label: 'Problem Solving Skills',
      description: 'Solve complex problems across multiple domains',
      required: 'Score 80%+ on 5 assessments',
      actual: '82% average on 5 assessments',
      passed: true,
      suggestion: '',
      category: 'Technical Skills',
      icon: 'Target',
      difficulty: 'Medium'
    },
    {
      id: 'documentation',
      label: 'Technical Documentation',
      description: 'Write clear technical documentation for your projects',
      required: '2 well-documented projects',
      actual: '2 projects documented',
      passed: true,
      suggestion: '',
      category: 'Project Portfolio',
      icon: 'BookOpen',
      difficulty: 'Easy'
    },
    {
      id: 'mentorship',
      label: 'Mentorship Sessions',
      description: 'Participate in mentorship sessions and learn from senior developers',
      required: 'Attend 6 mentorship sessions',
      actual: '6 sessions attended',
      passed: true,
      suggestion: '',
      category: 'Community Engagement',
      icon: 'Shield',
      difficulty: 'Easy'
    },
    {
      id: 'practice_hours',
      label: 'Practice Hours',
      description: 'Invest dedicated time in deliberate practice',
      required: '100 hours of coding practice',
      actual: '82 hours',
      passed: false,
      suggestion: 'Add 18 more hours of focused practice',
      category: 'Learning Consistency',
      icon: 'Clock',
      difficulty: 'Medium'
    },
    {
      id: 'tech_stack',
      label: 'Full Stack Proficiency',
      description: 'Demonstrate end-to-end development skills',
      required: 'Complete full stack project with frontend, backend, and database',
      actual: 'Full stack project completed',
      passed: true,
      suggestion: '',
      category: 'Technical Skills',
      icon: 'Code',
      difficulty: 'Hard'
    }
  ]
};

const STATUS_CONFIG = {
  'Eligible': {
    icon: PartyPopper,
    color: 'var(--accent-green)',
    bg: 'rgba(52,211,153,0.15)',
    emoji: '🎉',
    message: 'You\'re fully qualified! Start your placement journey today.',
    title: 'Ready for Placement'
  },
  'Nearly Eligible': {
    icon: Sparkles,
    color: 'var(--accent-gold)',
    bg: 'rgba(251,191,36,0.15)',
    emoji: '⚡',
    message: 'You\'re incredibly close! Just a few more steps to go.',
    title: 'Almost There'
  },
  'In Progress': {
    icon: TrendingUp,
    color: 'var(--accent-blue)',
    bg: 'rgba(96,165,250,0.15)',
    emoji: '🚀',
    message: 'Keep building your skills. You\'re making great progress!',
    title: 'Building Momentum'
  },
  'Not Eligible': {
    icon: Mountain,
    color: 'var(--accent-red)',
    bg: 'rgba(248,113,113,0.15)',
    emoji: '🏔️',
    message: 'Focus on completing the requirements below to unlock placement.',
    title: 'Needs More Work'
  }
};

const DIFFICULTY_COLORS = {
  'Easy': 'var(--accent-green)',
  'Medium': 'var(--accent-gold)',
  'Hard': 'var(--accent-red)'
};

export default function EligibilityStatus() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedCheck, setExpandedCheck] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
 const online = useOnlineStatus();

  useEffect(() => {
    const stored = localStorage.getItem('cq_user');
    const user = stored ? JSON.parse(stored) : null;
    setCurrentUser(user);

    // Simulate API call with enhanced data
    setTimeout(() => {
      setData(MOCK_ELIGIBILITY_DATA);
      setLoading(false);
    }, 800);
  }, []);

  const getStatusInfo = (status) => {
    return STATUS_CONFIG[status] || STATUS_CONFIG['In Progress'];
  };

  const getIconComponent = (iconName) => {
    const icons = {
      Brain, GitBranch, Rocket, Users, Flame, Medal, Target, 
      BookOpen, Shield, Clock, Code, Sparkles, Award,
      TrendingUp, Star, Compass, Mountain, Coffee, Heart
    };
    return icons[iconName] || Award;
  };

  const getDifficultyBadge = (difficulty) => {
    const colors = {
      'Easy': 'var(--accent-green)',
      'Medium': 'var(--accent-gold)',
      'Hard': 'var(--accent-red)'
    };
    return colors[difficulty] || 'var(--text-faint)';
  };

  const passedCount = data?.checks?.filter(c => c.passed).length || 0;
  const totalChecks = data?.checks?.length || 0;
  const progress = totalChecks > 0 ? Math.round((passedCount / totalChecks) * 100) : 0;

  const filteredChecks = useMemo(() => {
    if (!data?.checks) return [];
    if (filterCategory === 'all') return data.checks;
    return data.checks.filter(c => c.category === filterCategory);
  }, [data, filterCategory]);

  const categoryStats = useMemo(() => {
    if (!data?.checks) return {};
    return data.checks.reduce((acc, check) => {
      const cat = check.category || 'Other';
      if (!acc[cat]) acc[cat] = { total: 0, passed: 0 };
      acc[cat].total++;
      if (check.passed) acc[cat].passed++;
      return acc;
    }, {});
  }, [data]);

  const toggleExpand = (id) => {
    setExpandedCheck(expandedCheck === id ? null : id);
  };

  if (loading) {
    return (
      <div className="elig-loading">
        <div className="elig-loading-spinner" />
        <span className="elig-loading-text">Analyzing your progress...</span>
        <span className="elig-loading-sub">We're checking your eligibility requirements</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="elig-error">
        <div className="elig-error-icon">⚠️</div>
        <h2>Could not load eligibility data</h2>
        <p>Please try refreshing the page</p>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  const statusInfo = getStatusInfo(data.status);
  const StatusIcon = statusInfo.icon;
if (!online) {
  return (
    <div className="elig-page-wrapper">
      {/* Mobile Hamburger */}
      <button
        className="side-nav-hamburger"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {mobileMenuOpen && (
        <div
          className="side-nav-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <Sidebar
        userData={currentUser}
        isMobile={true}
        onClose={() => setMobileMenuOpen(false)}
        className={mobileMenuOpen ? "open" : ""}
      />

      <div className="elig-page">
        <OfflineNotice label="Eligibility Status" />
      </div>
    </div>
  );
}
  return (
    
    <div className="elig-page-wrapper">
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
        userData={currentUser}
        isMobile={true}
        onClose={() => setMobileMenuOpen(false)}
        className={mobileMenuOpen ? 'open' : ''}
      />

      <div className="elig-page">
        {/* ===== Hero Section ===== */}
        <section className="elig-hero">
          <div className="elig-hero-content">
            <div className="elig-hero-badge">
              <span className="elig-hero-badge-icon">🎯</span>
              Your Eligibility Journey
            </div>
            <h1 className="elig-hero-title">
              Unlock Your <span className="highlight">Placement</span> Potential
            </h1>
            <p className="elig-hero-sub">
              Track your progress across technical skills, projects, community engagement,
              and more. Each requirement brings you closer to your dream placement.
            </p>
          </div>
          
          <div className="elig-hero-stats">
            <div className="elig-hero-stat">
              <span className="elig-hero-stat-value">{data.passedCount}</span>
              <span className="elig-hero-stat-label">Completed</span>
            </div>
            <div className="elig-hero-stat-divider" />
            <div className="elig-hero-stat">
              <span className="elig-hero-stat-value">{data.total - data.passedCount}</span>
              <span className="elig-hero-stat-label">Remaining</span>
            </div>
            <div className="elig-hero-stat-divider" />
            <div className="elig-hero-stat">
              <span className="elig-hero-stat-value">{data.overallProgress || progress}%</span>
              <span className="elig-hero-stat-label">Progress</span>
            </div>
            <div className="elig-hero-stat-divider" />
            <div className="elig-hero-stat">
              <span className="elig-hero-stat-value">{data.categories?.length || 0}</span>
              <span className="elig-hero-stat-label">Skills</span>
            </div>
          </div>
        </section>

        {/* ===== Status Card ===== */}
        <section className="elig-status-section">
          <div className="elig-status-card" style={{ '--status-color': statusInfo.color }}>
            <div className="elig-status-left">
              <div className="elig-status-icon" style={{ background: statusInfo.bg, color: statusInfo.color }}>
                <StatusIcon size={28} />
              </div>
              <div className="elig-status-info">
                <div className="elig-status-header">
                  <div className="elig-status-badge" style={{ background: statusInfo.bg, color: statusInfo.color }}>
                    <span className="elig-status-emoji">{statusInfo.emoji}</span>
                    {statusInfo.title}
                  </div>
                  <span className="elig-status-percentage">{data.overallProgress || progress}%</span>
                </div>
                <p className="elig-status-message">{statusInfo.message}</p>
                <div className="elig-status-progress">
                  <div className="elig-status-progress-track">
                    <div 
                      className="elig-status-progress-fill" 
                      style={{ 
                        width: `${data.overallProgress || progress}%`, 
                        background: statusInfo.color 
                      }}
                    />
                  </div>
                  <span className="elig-status-progress-label">
                    {data.overallProgress || progress}% Complete
                  </span>
                </div>
              </div>
            </div>
            <div className="elig-status-right">
              <button className="elig-cta-btn" onClick={() => navigate('/placement')}>
                <Crown size={16} />
                Apply Now
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* ===== Category Progress ===== */}
        <section className="elig-categories">
          <div className="elig-section-header">
            <h2 className="elig-section-title">
              <BarChart3 size={20} />
              Skill Categories
            </h2>
            <span className="elig-section-subtitle">
              {Object.keys(categoryStats).length} areas of focus
            </span>
          </div>
          <div className="elig-categories-grid">
            {data.categories?.map((cat, idx) => {
              const stats = categoryStats[cat.name] || { total: 0, passed: 0 };
              const pct = stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0;
              const Icon = getIconComponent(cat.icon);
              return (
                <div key={idx} className="elig-category-card">
                  <div className="elig-category-header">
                    <div className="elig-category-icon-wrapper">
                      <Icon size={16} />
                    </div>
                    <span className="elig-category-name">{cat.name}</span>
                  </div>
                  <div className="elig-category-stats">
                    <span className="elig-category-count">{stats.passed}/{stats.total}</span>
                  </div>
                  <div className="elig-category-progress">
                    <div className="elig-category-progress-track">
                      <div 
                        className="elig-category-progress-fill" 
                        style={{ 
                          width: `${pct}%`,
                          background: pct === 100 ? 'var(--accent-green)' : 
                                     pct >= 50 ? 'var(--accent-gold)' : 
                                     'var(--accent-red)'
                        }}
                      />
                    </div>
                    <span className="elig-category-progress-label">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ===== Filter Bar ===== */}
        <section className="elig-filter-section">
          <div className="elig-filter-bar">
            <button 
              className={`elig-filter-btn ${filterCategory === 'all' ? 'active' : ''}`}
              onClick={() => setFilterCategory('all')}
            >
              <Sparkles size={14} />
              All Requirements
            </button>
            {Object.keys(categoryStats).map(cat => (
              <button 
                key={cat}
                className={`elig-filter-btn ${filterCategory === cat ? 'active' : ''}`}
                onClick={() => setFilterCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* ===== Requirements Checklist ===== */}
        <section className="elig-checks-section">
          <div className="elig-section-header">
            <h2 className="elig-section-title">
              <CheckCircle2 size={20} />
              Requirements Checklist
            </h2>
            <span className="elig-section-subtitle">
              {filteredChecks.filter(c => c.passed).length} of {filteredChecks.length} completed
            </span>
          </div>

          <div className="elig-checks">
            {filteredChecks.map((check, index) => {
              const Icon = getIconComponent(check.icon);
              const isExpanded = expandedCheck === check.id;
              const diffColor = getDifficultyBadge(check.difficulty);
              
              return (
                <div 
                  key={check.id} 
                  className={`elig-check-card ${check.passed ? 'elig-pass' : 'elig-fail'} ${isExpanded ? 'expanded' : ''}`}
                  style={{
                    animationDelay: `${index * 0.05}s`
                  }}
                >
                  <div className="elig-check-header" onClick={() => toggleExpand(check.id)}>
                    <div className="elig-check-left">
                      <div className={`elig-check-status ${check.passed ? 'pass' : 'fail'}`}>
                        {check.passed ? 
                          <CheckCircle2 size={16} /> : 
                          <XCircle size={16} />
                        }
                      </div>
                      <div className="elig-check-content">
                        <div className="elig-check-title">
                          <span className="elig-check-label">{check.label}</span>
                          <span className="elig-check-difficulty" style={{ color: diffColor }}>
                            {check.difficulty}
                          </span>
                        </div>
                        <span className="elig-check-category">{check.category}</span>
                      </div>
                    </div>
                    <div className="elig-check-right">
                      <div className={`elig-check-badge ${check.passed ? 'pass' : 'fail'}`}>
                        {check.passed ? '✅ Completed' : '⏳ In Progress'}
                      </div>
                      <Icon size={16} className="elig-check-icon-expand" />
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="elig-check-body">
                      <p className="elig-check-description">{check.description}</p>
                      
                      <div className="elig-check-values">
                        <div className="elig-check-value">
                          <span className="elig-value-label">Required</span>
                          <span className="elig-value-required">{check.required}</span>
                        </div>
                        <div className="elig-check-value-divider" />
                        <div className="elig-check-value">
                          <span className="elig-value-label">Your Progress</span>
                          <span className={`elig-value-actual ${check.passed ? 'pass' : 'fail'}`}>
                            {check.actual}
                          </span>
                        </div>
                      </div>

                      {!check.passed && check.suggestion && (
                        <div className="elig-suggestion">
                          <Sparkles size={14} />
                          <span>{check.suggestion}</span>
                        </div>
                      )}

                      <div className="elig-check-actions">
                        {!check.passed ? (
                          <button className="elig-action-btn primary">
                            <Target size={14} />
                            Focus on this
                          </button>
                        ) : (
                          <button className="elig-action-btn success">
                            <ThumbsUp size={14} />
                            Requirement Met!
                          </button>
                        )}
                        <button className="elig-action-btn secondary">
                          <BookOpen size={14} />
                          Learn More
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ===== Next Steps ===== */}
        <section className="elig-next-steps">
          <div className="elig-next-steps-card">
            <div className="elig-next-steps-content">
              <div className="elig-next-steps-icon">
                <Compass size={24} />
              </div>
              <h3>Ready to Accelerate Your Career?</h3>
              <p>
                {progress === 100 ? 
                  '🎉 Outstanding! You\'ve met all requirements. Your placement journey starts now!' :
                  `Complete ${data.total - data.passedCount} more requirement${data.total - data.passedCount > 1 ? 's' : ''} to unlock your placement opportunities. Every step brings you closer to your dream role.`
                }
              </p>
              <div className="elig-next-steps-actions">
                <button 
                  className="elig-primary-btn"
                  onClick={() => navigate('/languages')}
                >
                  <Code size={16} />
                  Continue Learning
                </button>
                {progress >= 80 && (
                  <button 
                    className="elig-success-btn"
                    onClick={() => navigate('/placement')}
                  >
                    <PartyPopper size={16} />
                    Start Placement Process
                  </button>
                )}
                <button 
                  className="elig-secondary-btn"
                  onClick={() => navigate('/achievements')}
                >
                  <Award size={16} />
                  View Achievements
                </button>
              </div>
            </div>
            <div className="elig-next-steps-mascot">
              <RabbitMascot size={80} mood={progress >= 80 ? 'celebration' : 'determined'} />
            </div>
          </div>
        </section>

        {/* ===== Motivational Quote ===== */}
        <footer className="elig-footer">
          <div className="elig-footer-content">
            <Heart size={18} className="elig-footer-heart" />
            <p className="elig-footer-quote">
              "The secret of getting ahead is getting started. Every requirement you complete is a step toward your future."
            </p>
            <span className="elig-footer-author">— Mark Twain</span>
          </div>
        </footer>
      </div>
    </div>
  );
}