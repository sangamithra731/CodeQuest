import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Gamepad2, Code2, Zap, Trophy, Star, Clock,
  Brain, Rocket, Target, Flame, Coffee, Bug,
  ChevronRight, Play, RefreshCw, Award, TrendingUp,
  Menu, X, Home, Swords, Briefcase, CheckCircle2,
  Sun, Moon, Settings, LogOut, Crown, Gem, Sparkles,
  AlertCircle, Check, X as XIcon, Timer, Volume2, VolumeX
} from 'lucide-react';
import './GameArcade.css';

// ============================================
// NAVIGATION ITEMS
// ============================================
const NAV_ITEMS = [
  { icon: Home, label: 'Home', path: '/dashboard' },
  { icon: Swords, label: 'Quests', path: '/languages' },
  { icon: Gamepad2, label: 'Arcade', path: '/arcade' },
  { icon: Briefcase, label: 'Placement', path: '/placement' },
  { icon: CheckCircle2, label: 'Eligibility', path: '/eligibility' },
];

// ============================================
// GAME CONFIGURATIONS
// ============================================
const GAME_TYPES = {
  CODE_BATTLE: 'code_battle',
  SPEED_TYPING: 'speed_typing',
  BUG_SQUASH: 'bug_squash',
  PUZZLE: 'puzzle',
  MEMORY: 'memory'
};

const GAMES = [
  {
    id: 'code-battle',
    title: 'Code Battle Royale',
    description: 'Race against time to write correct code snippets!',
    icon: <Code2 size={24} />,
    type: GAME_TYPES.CODE_BATTLE,
    difficulty: 'Medium',
    xpReward: 50,
    timeLimit: 60,
    color: '#8B5CF6',
    languages: ['JavaScript', 'Python', 'Java', 'C++'],
    popular: true
  },
  {
    id: 'speed-typing',
    title: 'Code Speed Typer',
    description: 'Type code snippets as fast as possible!',
    icon: <Zap size={24} />,
    type: GAME_TYPES.SPEED_TYPING,
    difficulty: 'Easy',
    xpReward: 30,
    timeLimit: 45,
    color: '#FBBF24',
    languages: ['All'],
    popular: true
  },
  {
    id: 'bug-squash',
    title: 'Bug Squasher',
    description: 'Find and fix bugs in the code!',
    icon: <Bug size={24} />,
    type: GAME_TYPES.BUG_SQUASH,
    difficulty: 'Hard',
    xpReward: 75,
    timeLimit: 90,
    color: '#EF4444',
    languages: ['JavaScript', 'Python'],
    popular: false
  },
  {
    id: 'code-puzzle',
    title: 'Code Puzzle Master',
    description: 'Rearrange code blocks to form correct programs!',
    icon: <Brain size={24} />,
    type: GAME_TYPES.PUZZLE,
    difficulty: 'Medium',
    xpReward: 40,
    timeLimit: 60,
    color: '#14B8A6',
    languages: ['Python', 'JavaScript'],
    popular: false
  },
  {
    id: 'memory-cards',
    title: 'Syntax Memory',
    description: 'Match programming concepts with their definitions!',
    icon: <Star size={24} />,
    type: GAME_TYPES.MEMORY,
    difficulty: 'Easy',
    xpReward: 25,
    timeLimit: 30,
    color: '#EC4899',
    languages: ['All'],
    popular: false
  }
];

// ============================================
// GAME 1: CODE BATTLE ROYALE
// ============================================
function CodeBattleGame({ onComplete, onCancel }) {
  const [code, setCode] = useState('');
  const [targetCode, setTargetCode] = useState('');
  const [targetHint, setTargetHint] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [language, setLanguage] = useState('JavaScript');
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [feedback, setFeedback] = useState({ show: false, correct: false, message: '' });

  const codeSnippets = {
    JavaScript: [
      { code: 'console.log("Hello World!");', hint: 'Print Hello World' },
      { code: 'function sum(a, b) { return a + b; }', hint: 'Sum function' },
      { code: 'const result = [1,2,3].map(x => x * 2);', hint: 'Array map' },
      { code: 'class Animal { constructor(name) { this.name = name; } }', hint: 'Class definition' },
      { code: 'const greeting = `Hello ${name}!`;', hint: 'Template literal' },
      { code: 'if (x > 0) { console.log("Positive"); }', hint: 'If statement' },
      { code: 'for (let i = 0; i < 10; i++) { console.log(i); }', hint: 'For loop' },
      { code: 'const doubled = numbers.map(n => n * 2);', hint: 'Arrow function' },
    ],
    Python: [
      { code: 'print("Hello World!")', hint: 'Print Hello World' },
      { code: 'def sum(a, b): return a + b', hint: 'Sum function' },
      { code: 'result = [x*2 for x in [1,2,3]]', hint: 'List comprehension' },
      { code: 'class Animal: def __init__(self, name): self.name = name', hint: 'Class definition' },
      { code: 'greeting = f"Hello {name}!"', hint: 'F-string' },
      { code: 'if x > 0: print("Positive")', hint: 'If statement' },
      { code: 'for i in range(10): print(i)', hint: 'For loop' },
      { code: 'doubled = list(map(lambda n: n * 2, numbers))', hint: 'Lambda function' },
    ],
    Java: [
      { code: 'System.out.println("Hello World!");', hint: 'Print Hello World' },
      { code: 'public int sum(int a, int b) { return a + b; }', hint: 'Sum method' },
      { code: 'int[] doubled = Arrays.stream(numbers).map(n -> n * 2).toArray();', hint: 'Stream map' },
      { code: 'public class Animal { private String name; public Animal(String name) { this.name = name; } }', hint: 'Class definition' },
    ],
    'C++': [
      { code: 'cout << "Hello World!" << endl;', hint: 'Print Hello World' },
      { code: 'int sum(int a, int b) { return a + b; }', hint: 'Sum function' },
      { code: 'vector<int> doubled; for (int n : numbers) { doubled.push_back(n * 2); }', hint: 'Vector loop' },
      { code: 'class Animal { private: string name; public: Animal(string n) : name(n) {} };', hint: 'Class definition' },
    ]
  };

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, gameOver]);

  useEffect(() => {
    loadNewChallenge();
  }, [language]);

  const loadNewChallenge = () => {
    const snippets = codeSnippets[language] || codeSnippets.JavaScript;
    const random = snippets[Math.floor(Math.random() * snippets.length)];
    setTargetCode(random.code);
    setTargetHint(random.hint);
    setCode('');
    setFeedback({ show: false, correct: false, message: '' });
  };

  const handleSubmit = () => {
    setTotalAttempts(prev => prev + 1);
    if (code.trim() === targetCode.trim()) {
      const bonus = streak >= 5 ? 5 : 0;
      const points = 10 + bonus;
      setScore(prev => prev + points);
      setCorrectAttempts(prev => prev + 1);
      setStreak(prev => prev + 1);
      if (streak + 1 > maxStreak) setMaxStreak(streak + 1);
      setFeedback({ show: true, correct: true, message: `✅ Correct! +${points} XP ${bonus > 0 ? `(🔥 ${streak + 1}x streak bonus!)` : ''}` });
      setTimeout(() => {
        loadNewChallenge();
      }, 800);
    } else {
      setStreak(0);
      setScore(prev => Math.max(0, prev - 2));
      setFeedback({ show: true, correct: false, message: '❌ Not quite right. Try again!' });
    }
  };

  const handleFinish = () => {
    onComplete(score, totalAttempts, correctAttempts);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && code.trim()) {
      handleSubmit();
    }
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="game-title">
          <Code2 size={20} style={{ color: '#8B5CF6' }} />
          <h3>Code Battle Royale</h3>
        </div>
        <div className="game-stats">
          <div className="game-stat">
            <Clock size={16} />
            <span className={timeLeft < 10 ? 'timer-warning' : ''}>{timeLeft}s</span>
          </div>
          <div className="game-stat">
            <Trophy size={16} />
            <span>{score} pts</span>
          </div>
          <div className="game-stat">
            <Flame size={16} />
            <span>{streak}x</span>
          </div>
        </div>
      </div>

      <div className="game-body">
        <div className="language-selector">
          {Object.keys(codeSnippets).map(lang => (
            <button
              key={lang}
              className={`lang-btn ${language === lang ? 'active' : ''}`}
              onClick={() => setLanguage(lang)}
              disabled={gameOver}
            >
              {lang}
            </button>
          ))}
        </div>

        <div className="challenge-box">
          <p className="challenge-hint">💡 {targetHint}</p>
          <div className="target-code">{targetCode}</div>
        </div>

        <textarea
          className="code-input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type the code here..."
          spellCheck={false}
          disabled={gameOver}
          rows={3}
        />

        {feedback.show && (
          <div className={`feedback-message ${feedback.correct ? 'correct' : 'incorrect'}`}>
            {feedback.message}
          </div>
        )}

        <div className="game-actions">
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={gameOver || !code.trim()}
          >
            <Target size={16} />
            Submit
          </button>
          <button className="btn-secondary" onClick={loadNewChallenge} disabled={gameOver}>
            <RefreshCw size={16} />
            Skip
          </button>
          <button className="btn-danger" onClick={handleFinish}>
            <Trophy size={16} />
            Finish
          </button>
        </div>

        {gameOver && (
          <div className="game-over">
            <h3>⏰ Time's Up!</h3>
            <p>You scored {score} points!</p>
            <div className="game-over-stats">
              <span>✅ {correctAttempts} correct</span>
              <span>📝 {totalAttempts} attempts</span>
              <span>🔥 Best streak: {maxStreak}x</span>
            </div>
            <button className="btn-primary" onClick={handleFinish}>
              Claim Reward 🎁
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// GAME 2: SPEED TYPING
// ============================================
function SpeedTypingGame({ onComplete, onCancel }) {
  const [text, setText] = useState('');
  const [targetText, setTargetText] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [accuracy, setAccuracy] = useState(100);
  const [totalChars, setTotalChars] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const codeSamples = [
    'const greeting = "Hello World!";',
    'function add(a, b) { return a + b; }',
    'console.log("Welcome to CodeQuest!");',
    'const result = 42;',
    'if (x > 0) { console.log("Positive"); }',
    'for (let i = 0; i < 10; i++) { console.log(i); }',
    'return value * 2;',
    'const user = { name: "Alice", age: 25 };',
    'class Animal { constructor(name) { this.name = name; } }',
    'const doubled = numbers.map(n => n * 2);',
  ];

  const inputRef = useRef(null);

  useEffect(() => {
    if (started && timeLeft > 0 && !completed) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [started, timeLeft, completed]);

  useEffect(() => {
    if (started && !completed) {
      const wpmCalc = setInterval(() => {
        const words = correctChars / 5;
        const minutes = (30 - timeLeft) / 60;
        if (minutes > 0) {
          setWpm(Math.round(words / minutes));
        }
      }, 2000);
      return () => clearInterval(wpmCalc);
    }
  }, [started, completed, timeLeft, correctChars]);

  const loadNewText = () => {
    const random = codeSamples[Math.floor(Math.random() * codeSamples.length)];
    setTargetText(random);
    setText('');
    setCharIndex(0);
  };

  const handleStart = () => {
    setStarted(true);
    setScore(0);
    setTotalChars(0);
    setCorrectChars(0);
    setAccuracy(100);
    loadNewText();
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleTextChange = (e) => {
    const value = e.target.value;
    setText(value);
    
    // Calculate accuracy
    const chars = value.split('');
    const targetChars = targetText.split('');
    let correct = 0;
    chars.forEach((char, i) => {
      if (i < targetChars.length && char === targetChars[i]) {
        correct++;
      }
    });
    setTotalChars(value.length);
    setCorrectChars(correct);
    setAccuracy(value.length > 0 ? Math.round((correct / value.length) * 100) : 100);

    // Check if complete
    if (value === targetText) {
      setScore(prev => prev + 10);
      loadNewText();
    }
  };

  const handleFinish = () => {
    const bonus = accuracy >= 90 ? 20 : accuracy >= 70 ? 10 : 0;
    const totalScore = score + bonus;
    onComplete(totalScore, totalChars, correctChars, wpm);
  };

  if (!started) {
    return (
      <div className="game-container">
        <div className="game-header">
          <div className="game-title">
            <Zap size={20} style={{ color: '#FBBF24' }} />
            <h3>Speed Typer</h3>
          </div>
        </div>
        <div className="game-body">
          <div className="game-rules">
            <h4>📝 How to Play</h4>
            <ul>
              <li>Type the code as fast as you can</li>
              <li>Each correct match = +10 points</li>
              <li>90%+ accuracy bonus = +20 points</li>
              <li>You have 30 seconds!</li>
            </ul>
          </div>
          <button className="btn-primary" onClick={handleStart}>
            <Play size={16} />
            Start Game 🚀
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="game-title">
          <Zap size={20} style={{ color: '#FBBF24' }} />
          <h3>Speed Typer</h3>
        </div>
        <div className="game-stats">
          <div className="game-stat">
            <Clock size={16} />
            <span className={timeLeft < 5 ? 'timer-warning' : ''}>{timeLeft}s</span>
          </div>
          <div className="game-stat">
            <Trophy size={16} />
            <span>{score} pts</span>
          </div>
          <div className="game-stat">
            <Target size={16} />
            <span>{accuracy}%</span>
          </div>
          <div className="game-stat">
            <Zap size={16} />
            <span>{wpm} WPM</span>
          </div>
        </div>
      </div>

      <div className="game-body">
        <div className="challenge-box">
          <p className="challenge-hint">📝 Type this code exactly:</p>
          <div className="target-code typing-target">
            {targetText.split('').map((char, i) => {
              const typed = text[i] || '';
              let className = 'char';
              if (i < text.length) {
                className += typed === char ? ' char-correct' : ' char-incorrect';
              }
              return (
                <span key={i} className={className}>
                  {char}
                </span>
              );
            })}
          </div>
        </div>

        <input
          ref={inputRef}
          className="type-input"
          type="text"
          value={text}
          onChange={handleTextChange}
          placeholder="Start typing..."
          disabled={completed}
          autoFocus
        />

        <div className="game-actions">
          <button className="btn-secondary" onClick={loadNewText} disabled={completed}>
            <RefreshCw size={16} />
            Skip
          </button>
          <button className="btn-danger" onClick={handleFinish}>
            <Trophy size={16} />
            Finish
          </button>
        </div>

        {completed && (
          <div className="game-over">
            <h3>⌨️ Time's Up!</h3>
            <p>You scored {score} points with {accuracy}% accuracy!</p>
            <div className="game-over-stats">
              <span>✅ {correctChars} correct chars</span>
              <span>📝 {totalChars} total chars</span>
              <span>⚡ {wpm} WPM</span>
            </div>
            <button className="btn-primary" onClick={handleFinish}>
              Claim Reward 🎁
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// GAME 3: BUG SQUASHER
// ============================================
function BugSquashGame({ onComplete, onCancel }) {
  const [code, setCode] = useState('');
  const [buggyCode, setBuggyCode] = useState('');
  const [bugDescription, setBugDescription] = useState('');
  const [timeLeft, setTimeLeft] = useState(90);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [bugsFixed, setBugsFixed] = useState(0);
  const [hint, setHint] = useState(false);

  const buggySnippets = {
    easy: [
      {
        code: 'console.log("Hello World"',
        bug: 'Missing closing parenthesis',
        fix: 'console.log("Hello World")',
        hint: 'Look at the parentheses'
      },
      {
        code: 'function sum(a b) { return a + b; }',
        bug: 'Missing comma between parameters',
        fix: 'function sum(a, b) { return a + b; }',
        hint: 'Parameters need a separator'
      },
    ],
    medium: [
      {
        code: 'const greeting = "Hello ${name}"',
        bug: 'Using wrong quotes for template literal',
        fix: 'const greeting = `Hello ${name}`',
        hint: 'Template literals use backticks'
      },
      {
        code: 'if (x = 5) { console.log("Five"); }',
        bug: 'Assignment instead of comparison',
        fix: 'if (x === 5) { console.log("Five"); }',
        hint: 'Check the condition operator'
      },
      {
        code: 'for (let i = 0 i < 10 i++) { console.log(i); }',
        bug: 'Missing semicolons in for loop',
        fix: 'for (let i = 0; i < 10; i++) { console.log(i); }',
        hint: 'For loop needs semicolons'
      },
    ],
    hard: [
      {
        code: 'const arr = [1,2,3]; arr.map(x => x * 2;',
        bug: 'Missing closing parenthesis in arrow function',
        fix: 'const arr = [1,2,3]; arr.map(x => x * 2);',
        hint: 'Check the arrow function syntax'
      },
      {
        code: 'class Animal { constructor(name) { this.name = name; } } const dog = Animal("Rex");',
        bug: 'Missing "new" keyword for class instantiation',
        fix: 'class Animal { constructor(name) { this.name = name; } } const dog = new Animal("Rex");',
        hint: 'Classes need to be instantiated with new'
      },
    ]
  };

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, gameOver]);

  useEffect(() => {
    loadNewBug();
  }, [difficulty]);

  const loadNewBug = () => {
    const snippets = buggySnippets[difficulty] || buggySnippets.medium;
    const random = snippets[Math.floor(Math.random() * snippets.length)];
    setBuggyCode(random.code);
    setBugDescription(random.bug);
    setCode('');
    setHint(false);
  };

  const handleCheckFix = () => {
    const currentBug = buggySnippets[difficulty].find(b => b.code === buggyCode);
    if (currentBug && code.trim() === currentBug.fix) {
      const points = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30;
      setScore(prev => prev + points);
      setBugsFixed(prev => prev + 1);
      loadNewBug();
    } else {
      setScore(prev => Math.max(0, prev - 3));
      setHint(true);
    }
  };

  const handleFinish = () => {
    onComplete(score, bugsFixed);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="game-title">
          <Bug size={20} style={{ color: '#EF4444' }} />
          <h3>Bug Squasher</h3>
        </div>
        <div className="game-stats">
          <div className="game-stat">
            <Clock size={16} />
            <span className={timeLeft < 10 ? 'timer-warning' : ''}>{timeLeft}s</span>
          </div>
          <div className="game-stat">
            <Trophy size={16} />
            <span>{score} pts</span>
          </div>
          <div className="game-stat">
            <Bug size={16} />
            <span>{bugsFixed} fixed</span>
          </div>
        </div>
      </div>

      <div className="game-body">
        <div className="difficulty-selector">
          {['easy', 'medium', 'hard'].map(level => (
            <button
              key={level}
              className={`diff-btn ${difficulty === level ? 'active' : ''}`}
              onClick={() => setDifficulty(level)}
              disabled={gameOver}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>

        <div className="challenge-box bug-box">
          <p className="challenge-hint">🐛 Bug: {bugDescription}</p>
          <div className="target-code bug-code">{buggyCode}</div>
        </div>

        <textarea
          className="code-input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Write the fixed code here..."
          spellCheck={false}
          disabled={gameOver}
          rows={3}
        />

        {hint && (
          <div className="hint-box">
            <AlertCircle size={16} />
            <span>💡 Hint: {buggySnippets[difficulty].find(b => b.code === buggyCode)?.hint}</span>
          </div>
        )}

        <div className="game-actions">
          <button
            className="btn-primary"
            onClick={handleCheckFix}
            disabled={gameOver || !code.trim()}
          >
            <Check size={16} />
            Fix Bug
          </button>
          <button className="btn-secondary" onClick={loadNewBug} disabled={gameOver}>
            <RefreshCw size={16} />
            Skip
          </button>
          <button className="btn-danger" onClick={handleFinish}>
            <Trophy size={16} />
            Finish
          </button>
        </div>

        {gameOver && (
          <div className="game-over">
            <h3>🐞 Time's Up!</h3>
            <p>You squashed {bugsFixed} bugs and scored {score} points!</p>
            <button className="btn-primary" onClick={handleFinish}>
              Claim Reward 🎁
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// GAME 4: CODE PUZZLE MASTER
// ============================================
function PuzzleGame({ onComplete, onCancel }) {
  const [puzzle, setPuzzle] = useState([]);
  const [solution, setSolution] = useState([]);
  const [userOrder, setUserOrder] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [language, setLanguage] = useState('JavaScript');
  const [level, setLevel] = useState(1);
  const [hint, setHint] = useState(false);

  const puzzles = {
    JavaScript: [
      {
        lines: ['function add(a, b) {', '  return a + b;', '}'],
        answer: ['function add(a, b) {', '  return a + b;', '}']
      },
      {
        lines: ['const doubled = numbers.map(', '  function(n) {', '    return n * 2;', '  }', ');'],
        answer: ['const doubled = numbers.map(', '  function(n) {', '    return n * 2;', '  }', ');']
      }
    ],
    Python: [
      {
        lines: ['def add(a, b):', '    return a + b'],
        answer: ['def add(a, b):', '    return a + b']
      },
      {
        lines: ['doubled = [', '    n * 2', '    for n in numbers', ']'],
        answer: ['doubled = [', '    n * 2', '    for n in numbers', ']']
      }
    ]
  };

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, gameOver]);

  useEffect(() => {
    loadPuzzle();
  }, [language, level]);

  const loadPuzzle = () => {
    const langPuzzles = puzzles[language] || puzzles.JavaScript;
    const puzzleIndex = Math.min(level - 1, langPuzzles.length - 1);
    const selected = langPuzzles[puzzleIndex] || langPuzzles[0];
    const shuffled = [...selected.lines].sort(() => Math.random() - 0.5);
    setPuzzle(shuffled);
    setSolution(selected.answer);
    setUserOrder([]);
    setHint(false);
  };

  const moveLine = (index, direction) => {
    const newOrder = [...userOrder];
    const [item] = newOrder.splice(index, 1);
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex <= newOrder.length) {
      newOrder.splice(newIndex, 0, item);
      setUserOrder(newOrder);
    }
  };

  const checkSolution = () => {
    if (JSON.stringify(userOrder) === JSON.stringify(solution)) {
      const bonus = timeLeft > 30 ? 10 : 5;
      setScore(prev => prev + 20 + bonus);
      setLevel(prev => prev + 1);
      loadPuzzle();
    } else {
      setScore(prev => Math.max(0, prev - 5));
      setHint(true);
    }
  };

  const handleFinish = () => {
    onComplete(score);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="game-title">
          <Brain size={20} style={{ color: '#14B8A6' }} />
          <h3>Code Puzzle Master</h3>
        </div>
        <div className="game-stats">
          <div className="game-stat">
            <Clock size={16} />
            <span className={timeLeft < 10 ? 'timer-warning' : ''}>{timeLeft}s</span>
          </div>
          <div className="game-stat">
            <Trophy size={16} />
            <span>{score} pts</span>
          </div>
          <div className="game-stat">
            <Star size={16} />
            <span>Level {level}</span>
          </div>
        </div>
      </div>

      <div className="game-body">
        <div className="language-selector">
          {Object.keys(puzzles).map(lang => (
            <button
              key={lang}
              className={`lang-btn ${language === lang ? 'active' : ''}`}
              onClick={() => setLanguage(lang)}
              disabled={gameOver}
            >
              {lang}
            </button>
          ))}
        </div>

        <div className="puzzle-container">
          <p className="challenge-hint">🧩 Arrange the code in the correct order:</p>
          <div className="puzzle-lines">
            {userOrder.map((line, index) => (
              <div key={index} className="puzzle-line">
                <span className="line-number">{index + 1}</span>
                <code>{line}</code>
                <div className="line-controls">
                  <button onClick={() => moveLine(index, 'up')} disabled={index === 0}>
                    ↑
                  </button>
                  <button onClick={() => moveLine(index, 'down')} disabled={index === userOrder.length - 1}>
                    ↓
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="puzzle-actions">
            <button className="btn-secondary" onClick={() => {
              const shuffled = [...puzzle].sort(() => Math.random() - 0.5);
              setUserOrder([]);
            }}>
              <RefreshCw size={16} />
              Reset
            </button>
            <button className="btn-primary" onClick={checkSolution} disabled={userOrder.length === 0}>
              <Check size={16} />
              Check
            </button>
          </div>
        </div>

        {hint && (
          <div className="hint-box">
            <AlertCircle size={16} />
            <span>💡 Hint: Think about the logical flow of the code</span>
          </div>
        )}

        <div className="game-actions">
          <button className="btn-danger" onClick={handleFinish}>
            <Trophy size={16} />
            Finish
          </button>
        </div>

        {gameOver && (
          <div className="game-over">
            <h3>⏰ Time's Up!</h3>
            <p>You completed Level {level - 1} with {score} points!</p>
            <button className="btn-primary" onClick={handleFinish}>
              Claim Reward 🎁
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// GAME 5: MEMORY CARDS
// ============================================
// ============================================
// GAME 5: MEMORY CARDS (Continued)
// ============================================
function MemoryGame({ onComplete, onCancel }) {
  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [moves, setMoves] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const concepts = [
    { term: 'Variable', definition: 'Stores data values' },
    { term: 'Function', definition: 'Reusable block of code' },
    { term: 'Array', definition: 'List of values' },
    { term: 'Object', definition: 'Collection of properties' },
    { term: 'Loop', definition: 'Repeats code' },
    { term: 'Conditional', definition: 'if/else statements' },
  ];

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, gameOver]);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const deck = [];
    concepts.forEach((concept, index) => {
      deck.push({ id: `term-${index}`, type: 'term', content: concept.term, pairId: index });
      deck.push({ id: `def-${index}`, type: 'definition', content: concept.definition, pairId: index });
    });
    // Shuffle
    const shuffled = deck.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setMatched([]);
    setSelected([]);
    setMoves(0);
    setScore(0);
    setIsLocked(false);
  };

  const handleCardClick = (index) => {
    if (isLocked) return;
    if (selected.includes(index)) return;
    if (matched.includes(index)) return;

    const newSelected = [...selected, index];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setIsLocked(true);
      setMoves(prev => prev + 1);

      const [first, second] = newSelected;
      if (cards[first].pairId === cards[second].pairId && first !== second) {
        // Match found
        setMatched(prev => [...prev, first, second]);
        setScore(prev => prev + 10);
        setSelected([]);
        setIsLocked(false);
      } else {
        // No match
        setTimeout(() => {
          setSelected([]);
          setIsLocked(false);
        }, 800);
      }
    }
  };

  const handleFinish = () => {
    const bonus = matched.length / 2;
    const totalScore = score + (bonus * 5);
    onComplete(totalScore, moves, matched.length / 2);
  };

  const isGameComplete = matched.length === cards.length;

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="game-title">
          <Star size={20} style={{ color: '#EC4899' }} />
          <h3>Syntax Memory</h3>
        </div>
        <div className="game-stats">
          <div className="game-stat">
            <Clock size={16} />
            <span className={timeLeft < 10 ? 'timer-warning' : ''}>{timeLeft}s</span>
          </div>
          <div className="game-stat">
            <Trophy size={16} />
            <span>{score} pts</span>
          </div>
          <div className="game-stat">
            <Target size={16} />
            <span>{matched.length / 2}/{concepts.length}</span>
          </div>
        </div>
      </div>

      <div className="game-body">
        <div className="memory-grid">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className={`memory-card ${selected.includes(index) ? 'selected' : ''} ${matched.includes(index) ? 'matched' : ''}`}
              onClick={() => handleCardClick(index)}
            >
              <div className="memory-card-inner">
                <div className="memory-card-front">
                  <span className="card-icon">❓</span>
                </div>
                <div className="memory-card-back">
                  <span className="card-content">{card.content}</span>
                  <span className="card-type">{card.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isGameComplete && (
          <div className="game-over">
            <h3>🎉 All Matched!</h3>
            <p>You found all pairs in {moves} moves!</p>
            <button className="btn-primary" onClick={handleFinish}>
              Claim Reward 🎁
            </button>
          </div>
        )}

        {gameOver && !isGameComplete && (
          <div className="game-over">
            <h3>⏰ Time's Up!</h3>
            <p>You matched {matched.length / 2} pairs with {score} points!</p>
            <button className="btn-primary" onClick={handleFinish}>
              Claim Reward 🎁
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// MAIN GAME ARCADE COMPONENT
// ============================================
export default function GameArcade() {
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState(() => localStorage.getItem('cq_theme') || 'dark');
  const [activeGame, setActiveGame] = useState(null);
  const [gameStats, setGameStats] = useState({
    totalGames: 0,
    totalXP: 0,
    bestScore: 0,
    streak: 0,
    gamesPlayed: []
  });
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [displayName, setDisplayName] = useState('Coder');
  const [showResultModal, setShowResultModal] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [selectedComingSoon, setSelectedComingSoon] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cq_theme', theme);
  }, [theme]);

  useEffect(() => {
    const stored = localStorage.getItem('cq_user');
    const user = stored ? JSON.parse(stored) : null;
    setDisplayName(user?.username || user?.name || 'Coder');

    // Load game stats from localStorage
    const stats = localStorage.getItem('game_stats');
    if (stats) {
      setGameStats(JSON.parse(stats));
    } else {
      // Initialize stats
      const defaultStats = {
        totalGames: 0,
        totalXP: 0,
        bestScore: 0,
        streak: 0,
        gamesPlayed: []
      };
      localStorage.setItem('game_stats', JSON.stringify(defaultStats));
      setGameStats(defaultStats);
    }
  }, []);

  const handleGameComplete = (score, attempts = 0, correct = 0, wpm = 0) => {
    const game = GAMES.find(g => g.id === activeGame?.id);
    const xpEarned = game ? game.xpReward : 20;
    const bonus = score > 50 ? 10 : 0;
    const totalXP = gameStats.totalXP + xpEarned + bonus;
    const bestScore = Math.max(gameStats.bestScore, score);
    
    const newGameRecord = {
      gameId: activeGame?.id || 'unknown',
      gameName: activeGame?.title || 'Game',
      score,
      xpEarned: xpEarned + bonus,
      attempts,
      correct,
      wpm,
      timestamp: new Date().toISOString()
    };
    
    const newStats = {
      totalGames: gameStats.totalGames + 1,
      totalXP: totalXP,
      bestScore: bestScore,
      streak: score > 50 ? gameStats.streak + 1 : 0,
      gamesPlayed: [...gameStats.gamesPlayed, newGameRecord]
    };
    
    setGameStats(newStats);
    localStorage.setItem('game_stats', JSON.stringify(newStats));
    
    setGameResult({
      score,
      xpEarned: xpEarned + bonus,
      totalXP: totalXP,
      bestScore: bestScore,
      gameName: activeGame?.title || 'Game',
      bonus,
      attempts,
      correct,
      wpm
    });
    setShowResultModal(true);
    setActiveGame(null);
  };

  const renderGame = () => {
    if (!activeGame) return null;

    switch (activeGame.type) {
      case GAME_TYPES.CODE_BATTLE:
        return <CodeBattleGame onComplete={handleGameComplete} onCancel={() => setActiveGame(null)} />;
      case GAME_TYPES.SPEED_TYPING:
        return <SpeedTypingGame onComplete={handleGameComplete} onCancel={() => setActiveGame(null)} />;
      case GAME_TYPES.BUG_SQUASH:
        return <BugSquashGame onComplete={handleGameComplete} onCancel={() => setActiveGame(null)} />;
      case GAME_TYPES.PUZZLE:
        return <PuzzleGame onComplete={handleGameComplete} onCancel={() => setActiveGame(null)} />;
      case GAME_TYPES.MEMORY:
        return <MemoryGame onComplete={handleGameComplete} onCancel={() => setActiveGame(null)} />;
      default:
        return (
          <div className="coming-soon-message">
            <Rocket size={48} />
            <h3>🚀 Coming Soon!</h3>
            <p>This game is under development. Stay tuned!</p>
            <button className="btn-primary" onClick={() => setActiveGame(null)}>
              Go Back
            </button>
          </div>
        );
    }
  };

  // Filter out games that are already fully implemented
  const availableGames = GAMES.filter(g => 
    ['code-battle', 'speed-typing', 'bug-squash', 'code-puzzle', 'memory-cards'].includes(g.id)
  );

  return (
    <div className="game-arcade-wrapper">
      {/* Mobile Nav Toggle */}
      <button 
        className="mobile-nav-toggle"
        onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
        aria-label="Toggle navigation"
      >
        {isMobileNavOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`side-nav ${isMobileNavOpen ? 'open' : ''}`}>
        <div className="side-nav-logo" onClick={() => navigate('/dashboard')}>
          <span className="side-nav-logo-icon"><Rocket size={20} /></span>
          <span className="side-nav-logo-text">CodeQuest</span>
        </div>

        <nav className="side-nav-links">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = location?.pathname === item.path;
            return (
              <button
                key={item.label}
                className={`side-nav-link ${active ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <Icon size={17} className="side-nav-link-icon" />
                <span>{item.label}</span>
                {item.label === 'Arcade' && (
                  <span className="nav-badge">🎮</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="side-nav-footer">
          <button
            className="side-nav-theme-btn"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
          </button>

          <div className="side-nav-user" onClick={() => navigate('/settings')}>
            <span className="side-nav-user-avatar">
              <div className="avatar-circle">👨‍💻</div>
            </span>
            <div className="side-nav-user-meta">
              <span className="side-nav-user-name">{displayName}</span>
              <span className="side-nav-user-level">
                🎮 {gameStats.totalGames} games · {gameStats.totalXP} XP
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

      {/* Main Content */}
      <div className="dash-content">
        <header className="arcade-topbar">
          <div className="topbar-left">
            <div className="topbar-badge-count">
              <Gamepad2 size={16} />
              <span>Game Arcade</span>
            </div>
            <h1 className="topbar-title-premium">🎮 CodeQuest Arcade</h1>
            <p className="topbar-sub-premium">
              Learn programming through fun games! 
              {gameStats.totalGames > 0 && ` You've played ${gameStats.totalGames} games`}
            </p>
          </div>
          <div className="topbar-right">
            <div className="arcade-stats-mini">
              <span>🔥 {gameStats.streak} streak</span>
              <span>🏆 {gameStats.bestScore} best</span>
              <button 
                className="sound-toggle"
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
            </div>
          </div>
        </header>

        <main className="arcade-main">
          {activeGame ? (
            <div className="game-modal">
              <div className="game-modal-content">
                <button className="modal-close" onClick={() => setActiveGame(null)}>
                  <X size={24} />
                </button>
                {renderGame()}
              </div>
            </div>
          ) : (
            <>
              {/* Stats Overview */}
              <div className="arcade-stats">
                <div className="stat-card">
                  <div className="stat-icon gold">🎮</div>
                  <div className="stat-info">
                    <div className="stat-value">{gameStats.totalGames}</div>
                    <div className="stat-label">Games Played</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon purple">⭐</div>
                  <div className="stat-info">
                    <div className="stat-value">{gameStats.totalXP}</div>
                    <div className="stat-label">XP Earned</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon pink">🏆</div>
                  <div className="stat-info">
                    <div className="stat-value">{gameStats.bestScore}</div>
                    <div className="stat-label">Best Score</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon teal">🔥</div>
                  <div className="stat-info">
                    <div className="stat-value">{gameStats.streak}</div>
                    <div className="stat-label">Win Streak</div>
                  </div>
                </div>
              </div>

              {/* Game Grid */}
              <div className="games-grid">
                {availableGames.map((game) => (
                  <div 
                    key={game.id}
                    className="game-card"
                    style={{ '--game-color': game.color }}
                    onClick={() => setActiveGame(game)}
                  >
                    <div className="game-card-glow" style={{ background: `radial-gradient(circle at center, ${game.color}33, transparent 70%)` }} />
                    <div className="game-card-header">
                      <div className="game-icon" style={{ background: game.color }}>
                        {game.icon}
                      </div>
                      {game.popular && (
                        <span className="popular-badge">🔥 Popular</span>
                      )}
                    </div>
                    <h3 className="game-card-title">{game.title}</h3>
                    <p className="game-card-desc">{game.description}</p>
                    <div className="game-card-tags">
                      <span className={`difficulty-${game.difficulty.toLowerCase()}`}>
                        {game.difficulty}
                      </span>
                      <span className="xp-tag">+{game.xpReward} XP</span>
                      <span className="time-tag">{game.timeLimit}s</span>
                    </div>
                    <div className="game-card-footer">
                      <span className="lang-tag">{game.languages.join(' • ')}</span>
                      <button className="play-btn" style={{ background: game.color }}>
                        <Play size={16} />
                        Play
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Games */}
              {gameStats.gamesPlayed.length > 0 && (
                <div className="recent-games">
                  <h3>📊 Recent Games</h3>
                  <div className="recent-games-grid">
                    {gameStats.gamesPlayed.slice(-4).reverse().map((game, index) => (
                      <div key={index} className="recent-game-card">
                        <span className="game-icon-small">🎮</span>
                        <div className="recent-game-info">
                          <span className="game-name">{game.gameName}</span>
                          <span className="game-score">Score: {game.score}</span>
                          <span className="game-xp">+{game.xpEarned} XP</span>
                        </div>
                        <span className="game-time">
                          {new Date(game.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Coming Soon */}
              <div className="coming-soon-section">
                <h3>🚀 Coming Soon</h3>
                <div className="coming-soon-grid">
                  <div 
                    className="coming-soon-card"
                    onClick={() => {
                      setSelectedComingSoon('Multiplayer Battles');
                      setShowComingSoon(true);
                    }}
                  >
                    <Code2 size={32} />
                    <h4>Multiplayer Battles</h4>
                    <p>Compete with friends in real-time coding challenges!</p>
                  </div>
                  <div 
                    className="coming-soon-card"
                    onClick={() => {
                      setSelectedComingSoon('Daily Challenges');
                      setShowComingSoon(true);
                    }}
                  >
                    <Coffee size={32} />
                    <h4>Daily Challenges</h4>
                    <p>New coding puzzles every day with special rewards!</p>
                  </div>
                  <div 
                    className="coming-soon-card"
                    onClick={() => {
                      setSelectedComingSoon('Seasonal Events');
                      setShowComingSoon(true);
                    }}
                  >
                    <Sparkles size={32} />
                    <h4>Seasonal Events</h4>
                    <p>Limited-time events with exclusive badges and rewards!</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Result Modal */}
      {showResultModal && gameResult && (
        <div className="result-modal">
          <div className="result-modal-content">
            <div className="result-icon">🎉</div>
            <h2>{gameResult.gameName} Complete!</h2>
            <div className="result-stats">
              <div className="result-stat">
                <span className="result-label">Score</span>
                <span className="result-value">{gameResult.score}</span>
              </div>
              <div className="result-stat">
                <span className="result-label">XP Earned</span>
                <span className="result-value">+{gameResult.xpEarned}</span>
              </div>
              <div className="result-stat">
                <span className="result-label">Total XP</span>
                <span className="result-value">{gameResult.totalXP}</span>
              </div>
              <div className="result-stat">
                <span className="result-label">Best Score</span>
                <span className="result-value">{gameResult.bestScore}</span>
              </div>
              {gameResult.bonus > 0 && (
                <div className="result-stat bonus">
                  <span className="result-label">Bonus</span>
                  <span className="result-value">+{gameResult.bonus} XP</span>
                </div>
              )}
              {gameResult.wpm > 0 && (
                <div className="result-stat">
                  <span className="result-label">WPM</span>
                  <span className="result-value">{gameResult.wpm}</span>
                </div>
              )}
              {gameResult.correct > 0 && (
                <div className="result-stat">
                  <span className="result-label">Accuracy</span>
                  <span className="result-value">
                    {Math.round((gameResult.correct / gameResult.attempts) * 100)}%
                  </span>
                </div>
              )}
            </div>
            <button 
              className="btn-primary"
              onClick={() => {
                setShowResultModal(false);
                setGameResult(null);
                // Check for achievement unlocks
                if (gameStats.totalGames >= 5) {
                  // Could trigger achievement here
                }
              }}
            >
              <Rocket size={16} />
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Coming Soon Modal */}
      {showComingSoon && (
        <div className="coming-soon-modal" onClick={() => setShowComingSoon(false)}>
          <div className="coming-soon-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <Rocket size={32} style={{ color: '#8B5CF6' }} />
              <h2>🚀 {selectedComingSoon}</h2>
              <button className="modal-close" onClick={() => setShowComingSoon(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="construction-icon">🏗️</div>
              <p>This feature is currently under development!</p>
              <p className="sub-text">We're working hard to bring you an amazing experience. Stay tuned for updates!</p>
              <button className="btn-primary" onClick={() => setShowComingSoon(false)}>
                <Star size={16} />
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}