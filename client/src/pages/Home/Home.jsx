import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const grassRowRef = useRef(null);
  const particleFieldRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const hero = heroRef.current;
    const grassRow = grassRowRef.current;
    const particleField = particleFieldRef.current;

    // ---- Generate grass blades ----
    const bladeCount = Math.ceil(window.innerWidth / 8);
    const bladeFrag = document.createDocumentFragment();
    for (let i = 0; i < bladeCount; i++) {
      const b = document.createElement('div');
      b.className = 'blade';
      b.style.animationDelay = Math.random() * 2 + 's';
      bladeFrag.appendChild(b);
    }
    grassRow.appendChild(bladeFrag);

    // ---- Floating particles ----
    const particleCount = 22;
    const particleFrag = document.createDocumentFragment();
    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.bottom = '-10px';
      p.style.animationDuration = 8 + Math.random() * 10 + 's';
      p.style.animationDelay = Math.random() * 10 + 's';
      particleFrag.appendChild(p);
    }
    particleField.appendChild(particleFrag);

    // ---- Subtle mouse parallax on the background image ----
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 16;
      const y = (e.clientY / window.innerHeight - 0.5) * 8;
      hero.style.backgroundPosition = `calc(50% + ${x}px) calc(100% + ${y}px)`;
    };
    const handleMouseLeave = () => {
      hero.style.backgroundPosition = '';
    };
    hero.addEventListener('mousemove', handleMouseMove);
    hero.addEventListener('mouseleave', handleMouseLeave);

    // ---- Cleanup on unmount ----
    return () => {
      hero.removeEventListener('mousemove', handleMouseMove);
      hero.removeEventListener('mouseleave', handleMouseLeave);
      grassRow.innerHTML = '';
      particleField.innerHTML = '';
    };
  }, []);

  const goToLanguages = () => navigate('/languages');
  const goToSignup = () => navigate('/signup');

  const handleHeroClick = (e) => {
    // don't hijack clicks on the button or text content itself
    if (e.target.closest('.cta-btn') || e.target.closest('.hero-content')) return;
    goToLanguages();
  };

  return (
    <div className="home-page">
      <nav>
        <div className="logo">
          <div className="logo-mark"></div>
          <div className="logo-text">Code<span>Grove</span></div>
        </div>

        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li><a href="#learn">Learn <span className="caret"></span></a></li>
          <li><a href="#practice">Practice <span className="caret"></span></a></li>
          <li><a href="#build">Build</a></li>
          <li><a href="#community">Community <span className="caret"></span></a></li>
          <li><a href="#pricing">Pricing</a></li>
        </ul>

        <div className="nav-icons">
          <button className="icon-btn" aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" />
              <line x1="12.5" y1="12.5" x2="17" y2="17" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
          <button className="icon-btn" aria-label="Toggle theme">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M15 10.5A6.5 6.5 0 1 1 7.5 3 5 5 0 0 0 15 10.5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button className="nav-cta" onClick={goToSignup}>Sign Up</button>
        </div>

        <button
          className="menu-toggle"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span></span><span></span><span></span>
        </button>
      </nav>

      <section className="hero" ref={heroRef} onClick={handleHeroClick}>
        <div className="layer ground">
          <div className="grass-row" ref={grassRowRef}></div>
        </div>

        <div ref={particleFieldRef}></div>

        <div className="hero-content">
          <div className="eyebrow">START YOUR</div>
          <h1 className="hero-title">
            Coding<br />
            <span className="accent">Adventure</span>
          </h1>
          <p className="hero-sub">
            The most fun and offline-friendly way to learn to code, anywhere. ✦
          </p>
          <button className="cta-btn" onClick={goToLanguages}>Get Started</button>
        </div>

        <div className="scroll-hint">
          <span>SCROLL</span>
          <div className="arrow"></div>
        </div>
      </section>

      <section className="below">
        <h2>25+ LANGUAGES. ZERO SIGNAL NEEDED.</h2>
        <p>
          CodeQuest works fully offline after your first visit — lessons, quizzes,
          and progress sync automatically the moment you're back online. Built for
          learners everywhere, not just where the internet reaches.
        </p>
      </section>
    </div>
  );
}