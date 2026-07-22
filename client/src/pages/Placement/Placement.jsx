import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Building2, Briefcase, ChevronRight, Sparkles, Award, 
  Brain, Code, Users, Clock, TrendingUp, Star, Zap,
  Target, BookOpen, ArrowLeft, CheckCircle, XCircle,
  Loader2, Medal, Trophy, GraduationCap, Rocket, MapPin,
  Filter, Search, Grid3x3, List, ChevronLeft, ChevronDown,
  BookMarked, Layers, BarChart3, Timer, Flame, Crown,
  AlertCircle, ThumbsUp, ThumbsDown, MessageSquare, Share2,
  Bookmark, BookmarkCheck, Eye, EyeOff, Play, Pause,
  RefreshCw, ArrowRight, Sun, Moon, Menu, X
} from 'lucide-react';
import { api } from '../../services/api';
import Sidebar from '../../components/common/Sidebar';
import './Placement.css';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import OfflineNotice from '../../components/common/OfflineNotice';

// ============================================
// LOADING COMPONENT
// ============================================
const LoadingSpinner = () => (
  <div className="placement-loading">
    <div className="loading-spinner" />
    <p>Loading placement data...</p>
  </div>
);

// ============================================
// UTILITY FUNCTIONS
// ============================================
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '108, 99, 255';
};

const adjustColor = (hex, amount) => {
  let r = parseInt(hex.slice(1,3), 16);
  let g = parseInt(hex.slice(3,5), 16);
  let b = parseInt(hex.slice(5,7), 16);
  r = Math.max(0, Math.min(255, r + amount));
  g = Math.max(0, Math.min(255, g + amount));
  b = Math.max(0, Math.min(255, b + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

const getCompanyColor = (name) => {
  const colors = {
    google: '#4285F4',
    microsoft: '#00A4EF',
    amazon: '#FF9900',
    meta: '#1877F2',
    netflix: '#E50914',
    apple: '#555555',
    uber: '#000000',
    airbnb: '#FF5A5F',
    stripe: '#635BFF',
    twilio: '#F22F46',
    salesforce: '#00A1E0',
    oracle: '#F80000',
    ibm: '#006699',
    deloitte: '#86BC25',
    'goldman-sachs': '#0A6E6E'
  };
  return colors[name?.toLowerCase()] || '#6C63FF';
};

// ============================================
// MOCK DATA GENERATOR - 50+ Questions Per Company
// ============================================
const generateQuestionsForCompany = (companyName, difficulty) => {
  const numQuestions = 50 + Math.floor(Math.random() * 30);
  const questions = [];

  const topics = {
    google: ['Algorithms', 'Data Structures', 'System Design', 'Machine Learning', 'Networking', 'Distributed Systems'],
    microsoft: ['Data Structures', 'Algorithms', 'OOP', 'Cloud Computing', 'OS Concepts', 'C#'],
    amazon: ['Algorithms', 'System Design', 'Leadership', 'Data Structures', 'AWS', 'Scalability'],
    meta: ['JavaScript', 'React', 'System Design', 'Algorithms', 'GraphQL', 'Frontend'],
    netflix: ['Java', 'Microservices', 'System Design', 'Cloud', 'Streaming', 'Performance'],
    apple: ['Swift', 'iOS', 'UI/UX', 'Design Patterns', 'Performance', 'Objective-C'],
    uber: ['Go', 'Python', 'Distributed Systems', 'Algorithms', 'System Design', 'Geolocation'],
    airbnb: ['JavaScript', 'React', 'Java', 'System Design', 'Data Modeling', 'Search'],
    stripe: ['API Design', 'Security', 'System Design', 'Ruby', 'JavaScript', 'Payments'],
    twilio: ['APIs', 'Cloud', 'JavaScript', 'Python', 'Communication', 'WebRTC'],
    salesforce: ['Java', 'Apex', 'Cloud', 'JavaScript', 'CRM', 'Sales'],
    oracle: ['Java', 'SQL', 'Oracle DB', 'Cloud', 'Microservices', 'Database'],
    ibm: ['Java', 'Python', 'Cloud', 'AI', 'Data Science', 'Enterprise'],
    deloitte: ['Excel', 'SQL', 'Business Analysis', 'Data Visualization', 'Consulting'],
    'goldman-sachs': ['Python', 'C++', 'Financial Modeling', 'Algorithms', 'System Design', 'Trading']
  };

  const companyTopics = topics[companyName.toLowerCase()] || ['General', 'Problem Solving', 'Technical'];

  const questionTypes = ['aptitude', 'coding', 'logical-reasoning', 'hr'];
  const difficultyLevels = ['easy', 'medium', 'hard', 'expert'];

  // Extensive question banks
  const aptitudeQuestions = [
    { q: 'If a train travels at 60 km/h, how far will it travel in 2.5 hours?', a: '150 km', options: ['120 km', '150 km', '180 km', '200 km'] },
    { q: 'What is the next number in the sequence: 2, 6, 12, 20, 30, ?', a: '42', options: ['36', '38', '42', '44'] },
    { q: 'A shirt costs $45 and is on sale for 20% off. What is the sale price?', a: '$36', options: ['$35', '$36', '$37', '$38'] },
    { q: 'If 3x + 7 = 22, what is x?', a: '5', options: ['3', '4', '5', '6'] },
    { q: 'What is 15% of 200?', a: '30', options: ['25', '30', '35', '40'] },
    { q: 'A company has 500 employees. If 60% are male, how many females work there?', a: '200', options: ['180', '200', '220', '240'] },
    { q: 'The average of 5 numbers is 20. If one number is 30, what is the average of the remaining 4?', a: '17.5', options: ['15', '16.5', '17.5', '18'] },
    { q: 'What is the area of a circle with radius 7 cm? (Use π = 22/7)', a: '154 cm²', options: ['144 cm²', '154 cm²', '164 cm²', '174 cm²'] },
    { q: 'A car travels 240 km in 4 hours. What is its average speed?', a: '60 km/h', options: ['55 km/h', '60 km/h', '65 km/h', '70 km/h'] },
    { q: 'What is the compound interest on $1000 at 10% for 2 years?', a: '$210', options: ['$200', '$210', '$220', '$230'] },
    { q: 'If A = 1, B = 2, C = 3, what is Z + A?', a: '27', options: ['25', '26', '27', '28'] },
    { q: 'What is the square root of 144?', a: '12', options: ['10', '11', '12', '13'] },
    { q: 'If a triangle has sides 3, 4, 5, what is its area?', a: '6', options: ['4', '5', '6', '7'] },
    { q: 'What is the LCM of 12 and 18?', a: '36', options: ['24', '30', '36', '42'] },
    { q: 'If 5x - 3 = 17, what is x?', a: '4', options: ['2', '3', '4', '5'] },
  ];

  const codingQuestions = [
    { q: 'Write a function to find the maximum element in an array.', a: 'Use Math.max or linear search', options: ['Use built-in methods', 'Implement linear search', 'Use sorting', 'All of the above'] },
    { q: 'Implement a binary search algorithm.', a: 'Recursive or iterative halving of search space', options: ['Linear search', 'Binary search', 'Hash table', 'Binary tree'] },
    { q: 'What is the time complexity of quicksort?', a: 'O(n log n) on average', options: ['O(n)', 'O(n²)', 'O(n log n)', 'O(log n)'] },
    { q: 'How do you reverse a linked list?', a: 'Use iterative or recursive reversal', options: ['Use stack', 'Use recursion', 'Use iteration', 'All of the above'] },
    { q: 'Explain the difference between stack and queue.', a: 'Stack is LIFO, Queue is FIFO', options: ['Both are LIFO', 'Both are FIFO', 'Stack LIFO, Queue FIFO', 'Stack FIFO, Queue LIFO'] },
    { q: 'What is a binary tree?', a: 'A tree with at most 2 children per node', options: ['A tree with exactly 2 children', 'A tree with at most 2 children', 'A tree with any number of children', 'A linear structure'] },
    { q: 'How do you detect a cycle in a linked list?', a: 'Use Floyd\'s cycle detection algorithm', options: ['Use hash table', 'Use two pointers', 'Both A and B', 'None of the above'] },
    { q: 'What is dynamic programming?', a: 'Breaking down complex problems into simpler subproblems', options: ['Using recursion', 'Memoization', 'Tabulation', 'All of the above'] },
    { q: 'Explain the concept of OOP.', a: 'Object-Oriented Programming with classes and objects', options: ['Procedural programming', 'Functional programming', 'Object-Oriented Programming', 'Declarative programming'] },
    { q: 'What is a hash table?', a: 'A data structure that maps keys to values using hashing', options: ['A sorted array', 'A linked list', 'A hash table', 'A binary search tree'] },
    { q: 'What is the difference between an array and a linked list?', a: 'Arrays have contiguous memory, linked lists are scattered', options: ['Both are same', 'Arrays are dynamic', 'Arrays have contiguous memory', 'Linked lists are faster'] },
    { q: 'What is a deadlock?', a: 'Two or more processes waiting for each other', options: ['One process waiting', 'Multiple processes waiting for each other', 'A stopped process', 'A crashed system'] },
    { q: 'What is the purpose of garbage collection?', a: 'Automatically free unused memory', options: ['Free all memory', 'Automatically free unused memory', 'Manual memory management', 'Delete all objects'] },
    { q: 'What is recursion?', a: 'A function calling itself', options: ['A loop', 'A function calling itself', 'A conditional statement', 'A data structure'] },
    { q: 'What is the time complexity of bubble sort?', a: 'O(n²)', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'] },
  ];

  const logicalQuestions = [
    { q: 'All mammals are animals. All dogs are mammals. What conclusion can you draw?', a: 'All dogs are animals', options: ['All animals are mammals', 'All dogs are mammals', 'All dogs are animals', 'All mammals are dogs'] },
    { q: 'If "ALL" is coded as "BMM", how is "CAT" coded?', a: 'DBU', options: ['DBU', 'DBV', 'CBU', 'DDU'] },
    { q: 'Which number doesn\'t belong: 2, 4, 8, 16, 32, 64?', a: 'All are powers of 2', options: ['All are powers of 2', 'Some are odd', 'None are odd', 'All are even'] },
    { q: 'What is the missing number: 2, 6, 12, 20, 30, __?', a: '42', options: ['38', '40', '42', '44'] },
    { q: 'If A = 1, B = 2, C = 3, what is Z?', a: '26', options: ['24', '25', '26', '27'] },
    { q: 'All squares are rectangles. All rectangles are quadrilaterals. What conclusion can you draw?', a: 'All squares are quadrilaterals', options: ['All quadrilaterals are squares', 'All squares are quadrilaterals', 'All rectangles are squares', 'None of the above'] },
    { q: 'What is the odd one out: Apple, Banana, Orange, Carrot?', a: 'Carrot (not a fruit)', options: ['Apple', 'Banana', 'Orange', 'Carrot'] },
    { q: 'If train is to tracks as car is to __?', a: 'Road', options: ['Tires', 'Road', 'Engine', 'Wheels'] },
    { q: 'What comes next: A, C, E, G, __?', a: 'I', options: ['H', 'I', 'J', 'K'] },
    { q: 'All cats are animals. Some animals are pets. What can you conclude?', a: 'Some pets are animals', options: ['All cats are pets', 'Some pets are animals', 'All animals are cats', 'None of the above'] },
    { q: 'If RED is coded as 27, GREEN is coded as 49, what is BLUE?', a: '40', options: ['38', '39', '40', '41'] },
    { q: 'What is the next in series: 1, 1, 2, 3, 5, 8, __?', a: '13', options: ['11', '12', '13', '14'] },
    { q: 'Which word is the odd one: Dog, Cat, Horse, Car?', a: 'Car', options: ['Dog', 'Cat', 'Horse', 'Car'] },
    { q: 'If Monday = 1, Tuesday = 2, what is Friday?', a: '5', options: ['4', '5', '6', '7'] },
    { q: 'What is the opposite of "Happiness"?', a: 'Sadness', options: ['Anger', 'Sadness', 'Fear', 'Disgust'] },
  ];

  const hrQuestions = [
    { q: 'Tell me about yourself.', a: 'Provide a brief professional summary highlighting key achievements', options: ['Focus on personal details', 'Provide a professional summary', 'Discuss family', 'Talk about hobbies'] },
    { q: 'Why do you want to work here?', a: 'Research the company and align with values', options: ['For money', 'For location', 'Research the company', 'For work-life balance'] },
    { q: 'What is your greatest strength?', a: 'Provide a specific skill with example', options: ['I work hard', 'Provide a specific skill', 'I am smart', 'I don\'t have any'] },
    { q: 'What is your greatest weakness?', a: 'Be honest and show how you overcome it', options: ['I don\'t have any', 'Be honest and improve', 'I am perfect', 'I am lazy'] },
    { q: 'Where do you see yourself in 5 years?', a: 'Show ambition and growth mindset', options: ['Still here', 'Show ambition', 'I don\'t know', 'Retired'] },
    { q: 'Tell me about a challenge you faced.', a: 'Use STAR method to describe situation', options: ['Just the problem', 'STAR method', 'Only solution', 'Only result'] },
    { q: 'How do you handle criticism?', a: 'Receive it openly and learn from it', options: ['Ignore it', 'Receive openly', 'Get defensive', 'Get angry'] },
    { q: 'How do you handle pressure?', a: 'Stay calm and prioritize tasks', options: ['Panic', 'Stay calm', 'Give up', 'Work non-stop'] },
    { q: 'What are your salary expectations?', a: 'Research industry standards', options: ['Pick a number', 'Research standards', 'The highest', 'The lowest'] },
    { q: 'Do you have any questions for us?', a: 'Ask about team, culture, or growth', options: ['No', 'About team', 'About culture', 'About growth'] },
    { q: 'How do you work in a team?', a: 'Collaborate effectively and communicate clearly', options: ['Work alone', 'Collaborate effectively', 'Delegate all tasks', 'Never share ideas'] },
    { q: 'What motivates you?', a: 'Clear goals and growth opportunities', options: ['Money only', 'Clear goals', 'Recognition', 'All of the above'] },
    { q: 'How do you prioritize tasks?', a: 'Based on urgency and importance', options: ['Randomly', 'Based on urgency', 'Based on importance', 'Both urgency and importance'] },
    { q: 'Tell me about a time you failed.', a: 'Be honest and show what you learned', options: ['Don\'t mention', 'Be honest', 'Blame others', 'Make excuses'] },
    { q: 'How do you handle conflicts?', a: 'Address issues directly and professionally', options: ['Avoid them', 'Address directly', 'Escalate immediately', 'Ignore the problem'] },
  ];

  // Generate questions
  for (let i = 0; i < numQuestions; i++) {
    const type = questionTypes[i % questionTypes.length];
    let questionData;
    let difficultyLevel = difficultyLevels[Math.floor(Math.random() * difficultyLevels.length)];
    
    // Weight difficulty based on company difficulty
    if (difficulty === 'easy' && Math.random() < 0.7) difficultyLevel = 'easy';
    else if (difficulty === 'hard' && Math.random() < 0.7) difficultyLevel = 'hard';
    else if (difficulty === 'expert' && Math.random() < 0.8) difficultyLevel = 'expert';

    const topic = companyTopics[Math.floor(Math.random() * companyTopics.length)];

    switch(type) {
      case 'aptitude':
        const aptQ = aptitudeQuestions[i % aptitudeQuestions.length];
        questionData = {
          id: `apt-${i}`,
          type: 'aptitude',
          difficulty: difficultyLevel,
          topic: 'Aptitude',
          question: aptQ.q,
          options: aptQ.options,
          answer: aptQ.a,
          explanation: `💡 The correct answer is "${aptQ.a}". ${difficultyLevel === 'hard' ? 'This requires careful calculation and attention to detail.' : 'Use basic arithmetic to solve this.'}`
        };
        break;
      case 'coding':
        const codQ = codingQuestions[i % codingQuestions.length];
        questionData = {
          id: `code-${i}`,
          type: 'coding',
          difficulty: difficultyLevel,
          topic: topic,
          question: codQ.q,
          options: codQ.options,
          answer: codQ.a,
          explanation: `💡 ${codQ.a}. ${difficultyLevel === 'hard' || difficultyLevel === 'expert' ? 'This requires deep understanding of the concept.' : 'This is a fundamental concept in programming.'}`
        };
        break;
      case 'logical-reasoning':
        const logQ = logicalQuestions[i % logicalQuestions.length];
        questionData = {
          id: `logic-${i}`,
          type: 'logical-reasoning',
          difficulty: difficultyLevel,
          topic: 'Logical Reasoning',
          question: logQ.q,
          options: logQ.options,
          answer: logQ.a,
          explanation: `💡 The correct answer is "${logQ.a}". ${difficultyLevel === 'hard' ? 'Think carefully about the logical relationships.' : 'Apply basic logical deduction.'}`
        };
        break;
      default:
        const hrQ = hrQuestions[i % hrQuestions.length];
        questionData = {
          id: `hr-${i}`,
          type: 'hr',
          difficulty: difficultyLevel,
          topic: 'HR',
          question: hrQ.q,
          options: hrQ.options,
          answer: hrQ.a,
          explanation: `💡 The best answer is: "${hrQ.a}". ${difficultyLevel === 'hard' ? 'Provide specific examples and be authentic.' : 'Be honest and professional.'}`
        };
    }

    questions.push(questionData);
  }

  return questions;
};

// ============================================
// COMPANY CARD COMPONENT
// ============================================
function CompanyCard({ company, onClick }) {
  const color = getCompanyColor(company.name);
  
  return (
    <div 
      className={`company-card ${!company.available ? 'company-card-soon' : ''}`}
      onClick={() => company.available && onClick()}
    >
      <div className="company-card-glow" style={{ background: `radial-gradient(circle at 50% 0%, ${color}22, transparent 70%)` }} />
      
      <div className="company-card-top">
        <div className="company-icon" style={{ background: `${color}22`, color: color }}>
          <Building2 size={24} />
        </div>
        <span className={`company-status ${company.available ? 'available' : 'soon'}`}>
          {company.available ? 'Available' : 'Coming Soon'}
        </span>
      </div>

      <h3 className="company-name">{company.name}</h3>
      
      <div className="company-meta">
        <div className="company-info-item">
          <Briefcase size={14} />
          <span>{company.salaryRange || 'Competitive'}</span>
        </div>
        <div className="company-info-item">
          <Clock size={14} />
          <span>{company.duration || '2-3 hrs'}</span>
        </div>
      </div>

      <div className="company-stats-mini">
        <div className="stat-mini">
          <Layers size={12} />
          <span>{company.questions?.length || 0} Questions</span>
        </div>
        <div className="stat-mini">
          <Award size={12} />
          <span className={`difficulty-${company.difficulty || 'medium'}`}>
            {company.difficulty || 'Medium'}
          </span>
        </div>
      </div>

      {company.skills && (
        <div className="company-skills">
          {company.skills.slice(0, 4).map((skill, i) => (
            <span key={i} className="skill-tag">{skill}</span>
          ))}
          {company.skills.length > 4 && (
            <span className="skill-tag more">+{company.skills.length - 4}</span>
          )}
        </div>
      )}

      <div className="company-action">
        {company.available ? (
          <button className="start-btn" style={{ background: `linear-gradient(135deg, ${color}, ${adjustColor(color, -30)})` }}>
            Start Practice
            <ChevronRight size={16} />
          </button>
        ) : (
          <div className="coming-soon">
            <Sparkles size={16} />
            <span>Coming Soon</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// PLACEMENT LIST COMPONENT
// ============================================
export function PlacementList() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
const online = useOnlineStatus();

  useEffect(() => {
    const stored = localStorage.getItem('cq_user');
    const user = stored ? JSON.parse(stored) : null;
    setCurrentUser(user);

    // Generate mock companies with 50+ questions each
    const mockCompanies = [
      { id: 1, name: 'Google', slug: 'google', difficulty: 'hard', salaryRange: '$120K - $200K', duration: '3-4 hours', available: true, completed: false, inProgress: false, skills: ['Python', 'Java', 'Data Structures', 'Algorithms', 'System Design', 'ML', 'Distributed Systems'] },
      { id: 2, name: 'Microsoft', slug: 'microsoft', difficulty: 'medium', salaryRange: '$110K - $180K', duration: '2-3 hours', available: true, completed: false, inProgress: false, skills: ['C#', '.NET', 'Azure', 'Data Structures', 'OOP', 'Cloud'] },
      { id: 3, name: 'Amazon', slug: 'amazon', difficulty: 'hard', salaryRange: '$130K - $210K', duration: '3-4 hours', available: true, completed: false, inProgress: false, skills: ['Java', 'AWS', 'System Design', 'Leadership', 'Algorithms'] },
      { id: 4, name: 'Meta', slug: 'meta', difficulty: 'hard', salaryRange: '$125K - $205K', duration: '3 hours', available: true, completed: false, inProgress: false, skills: ['JavaScript', 'React', 'GraphQL', 'System Design', 'Algorithms'] },
      { id: 5, name: 'Netflix', slug: 'netflix', difficulty: 'expert', salaryRange: '$140K - $230K', duration: '4-5 hours', available: false, completed: false, inProgress: false, skills: ['Java', 'Spring Boot', 'Microservices', 'Cloud', 'System Design'] },
      { id: 6, name: 'Apple', slug: 'apple', difficulty: 'medium', salaryRange: '$115K - $195K', duration: '2-3 hours', available: true, completed: false, inProgress: false, skills: ['Swift', 'Objective-C', 'iOS', 'UI/UX', 'Design Patterns'] },
      { id: 7, name: 'Uber', slug: 'uber', difficulty: 'hard', salaryRange: '$125K - $200K', duration: '3 hours', available: true, completed: false, inProgress: false, skills: ['Python', 'Go', 'Distributed Systems', 'Algorithms', 'System Design'] },
      { id: 8, name: 'Airbnb', slug: 'airbnb', difficulty: 'medium', salaryRange: '$110K - $185K', duration: '2-3 hours', available: true, completed: false, inProgress: false, skills: ['JavaScript', 'React', 'Java', 'System Design', 'Data Modeling'] },
      { id: 9, name: 'Stripe', slug: 'stripe', difficulty: 'hard', salaryRange: '$130K - $210K', duration: '3-4 hours', available: false, completed: false, inProgress: false, skills: ['Ruby', 'JavaScript', 'API Design', 'Security', 'System Design'] },
      { id: 10, name: 'Twilio', slug: 'twilio', difficulty: 'medium', salaryRange: '$105K - $175K', duration: '2 hours', available: true, completed: false, inProgress: false, skills: ['JavaScript', 'Python', 'APIs', 'Cloud', 'Communication'] },
      { id: 11, name: 'Salesforce', slug: 'salesforce', difficulty: 'medium', salaryRange: '$110K - $180K', duration: '2-3 hours', available: true, completed: false, inProgress: false, skills: ['Java', 'JavaScript', 'Apex', 'Cloud', 'CRM'] },
      { id: 12, name: 'Oracle', slug: 'oracle', difficulty: 'medium', salaryRange: '$105K - $170K', duration: '2 hours', available: true, completed: false, inProgress: false, skills: ['Java', 'SQL', 'Oracle DB', 'Cloud', 'Microservices'] },
      { id: 13, name: 'IBM', slug: 'ibm', difficulty: 'easy', salaryRange: '$90K - $150K', duration: '1-2 hours', available: true, completed: false, inProgress: false, skills: ['Java', 'Python', 'Cloud', 'AI', 'Data Science'] },
      { id: 14, name: 'Deloitte', slug: 'deloitte', difficulty: 'easy', salaryRange: '$85K - $140K', duration: '1-2 hours', available: true, completed: false, inProgress: false, skills: ['Excel', 'SQL', 'Business Analysis', 'Data Visualization'] },
      { id: 15, name: 'Goldman Sachs', slug: 'goldman-sachs', difficulty: 'hard', salaryRange: '$130K - $220K', duration: '3-4 hours', available: true, completed: false, inProgress: false, skills: ['Python', 'C++', 'Financial Modeling', 'Algorithms', 'System Design'] },
    ];

    // Add questions to each company
    const companiesWithQuestions = mockCompanies.map(c => ({
      ...c,
      questions: generateQuestionsForCompany(c.name, c.difficulty)
    }));

    setCompanies(companiesWithQuestions);
    setStats({
      total: companiesWithQuestions.length,
      completed: companiesWithQuestions.filter(c => c.completed).length,
      inProgress: companiesWithQuestions.filter(c => c.inProgress).length
    });
    setLoading(false);
  }, []);

  const filteredCompanies = useMemo(() => {
    if (!companies) return [];
    return companies.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           c.skills?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesDifficulty = filterDifficulty === 'all' || c.difficulty === filterDifficulty;
      return matchesSearch && matchesDifficulty;
    });
  }, [companies, searchTerm, filterDifficulty]);

  if (loading) return <LoadingSpinner />;
if (!online) {
  return (
    <div className="dash-shell">
      <Sidebar
        userData={currentUser}
        isMobile={true}
        onClose={() => setMobileMenuOpen(false)}
        className={mobileMenuOpen ? "open" : ""}
      />

      <div className="dash-content">
        <main className="dash-main">
          <OfflineNotice label="Placement Training" />
        </main>
      </div>
    </div>
  );
}
  return (
    <div className="placement-page-wrapper dash-shell">
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

      <div className="dash-content placement-page">
        <header className="placement-header">
          <div className="header-wrapper">
            <div className="header-badge">
              <Award size={18} />
              <span>Placement Prep</span>
            </div>
            
            <h1 className="header-title">
              <span className="gradient-text">Placement</span>
              <span className="highlight-text">Training</span>
            </h1>
            
            <p className="header-subtitle">
              Master company-specific patterns with 50+ real, sourced questions each
            </p>

            <div className="header-search">
              <div className="search-box">
                <Search size={18} />
                <input 
                  type="text" 
                  placeholder="Search companies or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="filter-box">
                <Filter size={18} />
                <select value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)}>
                  <option value="all">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </div>

            <div className="stats-container">
              <div className="stat-box">
                <div className="stat-icon blue">
                  <Building2 size={18} />
                </div>
                <div className="stat-content">
                  <span className="stat-number">{stats.total}</span>
                  <span className="stat-label">Companies</span>
                </div>
              </div>
              
              <div className="stat-divider" />
              
              <div className="stat-box">
                <div className="stat-icon green">
                  <CheckCircle size={18} />
                </div>
                <div className="stat-content">
                  <span className="stat-number">{stats.completed}</span>
                  <span className="stat-label">Completed</span>
                </div>
              </div>
              
              <div className="stat-divider" />
              
              <div className="stat-box">
                <div className="stat-icon yellow">
                  <TrendingUp size={18} />
                </div>
                <div className="stat-content">
                  <span className="stat-number">{stats.inProgress}</span>
                  <span className="stat-label">In Progress</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="companies-container">
          <div className="section-header">
            <div className="section-header-left">
              <h2>Available Companies</h2>
              <span className="company-count">{filteredCompanies.length} opportunities</span>
            </div>
          </div>

          <div className="companies-grid">
            {filteredCompanies.map((c) => (
              <CompanyCard 
                key={c.id} 
                company={c} 
                onClick={() => navigate(`/placement/${c.slug}`)}
              />
            ))}
          </div>

          {filteredCompanies.length === 0 && (
            <div className="no-results">
              <Search size={48} />
              <h3>No companies found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// QUESTION TYPE ICON MAPPER
// ============================================
const getQuestionIcon = (type) => {
  const icons = {
    aptitude: <Brain size={16} />,
    coding: <Code size={16} />,
    hr: <Users size={16} />,
    'logical-reasoning': <Target size={16} />
  };
  return icons[type] || <BookOpen size={16} />;
};

// ============================================
// QUESTION CARD COMPONENT
// ============================================
// ============================================
// QUESTION CARD COMPONENT (continued)
// ============================================
function QuestionCard({ question, index, showAnswer, onToggleAnswer, onBookmark, isBookmarked }) {
  const getDifficultyColor = (diff) => {
    const colors = { easy: '#00D4AA', medium: '#FFB347', hard: '#FF6B6B', expert: '#FF4081' };
    return colors[diff] || '#6C63FF';
  };

  return (
    <div className="question-card">
      <div className="question-card-header">
        <div className="q-left">
          <span className="q-number">Q{index + 1}</span>
          <span className="q-topic">{question.topic || 'General'}</span>
        </div>
        <div className="q-tags">
          <span className={`q-type ${question.type}`}>
            {getQuestionIcon(question.type)}
            {question.type === 'logical-reasoning' ? 'Logical' : question.type.toUpperCase()}
          </span>
          <span className="q-difficulty" style={{ 
            background: `rgba(${hexToRgb(getDifficultyColor(question.difficulty))}, 0.15)`, 
            color: getDifficultyColor(question.difficulty) 
          }}>
            {question.difficulty}
          </span>
          <button className="q-bookmark" onClick={() => onBookmark?.(index)}>
            {isBookmarked ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
          </button>
        </div>
      </div>

      <p className="q-text">{question.question}</p>

      {question.options && (
        <ul className="q-options">
          {question.options.map((opt, i) => (
            <li key={i} className={`q-option ${showAnswer && opt === question.answer ? 'correct' : ''}`}>
              <span className="option-letter">{String.fromCharCode(65 + i)}.</span>
              <span>{opt}</span>
              {showAnswer && opt === question.answer && <CheckCircle size={14} className="correct-icon" />}
            </li>
          ))}
        </ul>
      )}

      <div className="q-answer-wrapper">
        <button 
          className="answer-toggle"
          onClick={() => onToggleAnswer(index)}
        >
          {showAnswer ? <EyeOff size={14} /> : <Eye size={14} />}
          {showAnswer ? 'Hide' : 'Show'} Explanation
          <ChevronRight size={14} className={`toggle-arrow ${showAnswer ? 'rotated' : ''}`} />
        </button>
        
        {showAnswer && (
          <div className="answer-content">
            <div className="answer-badge">
              <CheckCircle size={14} />
              <span>Answer</span>
            </div>
            <p className="answer-text">{question.answer}</p>
            {question.explanation && (
              <>
                <div className="explanation-badge">
                  <MessageSquare size={14} />
                  <span>Explanation</span>
                </div>
                <p className="explanation-text">{question.explanation}</p>
              </>
            )}
          </div>
        )}
      </div>

      <div className="q-actions">
        <button className="q-action-btn"><ThumbsUp size={14} /></button>
        <button className="q-action-btn"><ThumbsDown size={14} /></button>
        <button className="q-action-btn"><Share2 size={14} /></button>
      </div>
    </div>
  );
}

// ============================================
// PAGINATION COMPONENT
// ============================================
function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pages = [];
    const delta = 2;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  return (
    <div className="pagination">
      <button 
        className="page-btn" 
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft size={16} />
      </button>
      {getPageNumbers().map((page, i) => (
        <button 
          key={i}
          className={`page-btn ${page === currentPage ? 'active' : ''}`}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
        >
          {page}
        </button>
      ))}
      <button 
        className="page-btn"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

// ============================================
// APTITUDE QUIZ COMPONENT
// ============================================
function AptitudeQuiz({ slug, questions }) {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(1800);
  const [timerActive, setTimerActive] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;

  useEffect(() => {
    let timer;
    if (timerActive && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerActive, timeRemaining]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);
  const progress = (Object.keys(answers).length / questions.length) * 100;

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const payload = questions.map((q) => ({ 
        questionId: q.id, 
        selectedIndex: answers[q.id] 
      }));
      const res = await api.post(`/api/placement/companies/${slug}/attempt`, { answers: payload });
      setResult(res.data.result);
      setShowResults(true);
      setTimerActive(false);
    } catch (err) {
      setError('Could not submit your answers. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getPaginatedQuestions = () => {
    const start = (currentPage - 1) * questionsPerPage;
    const end = start + questionsPerPage;
    return questions.slice(start, end);
  };

  if (showResults && result) {
    return (
      <div className="quiz-result-container">
        <div className="result-icon-wrapper">
          {result.scorePercent >= 70 ? <Trophy size={32} /> : <Medal size={32} />}
        </div>
        <h3>Quiz Complete!</h3>
        <p className="result-subtitle">
          {result.scorePercent >= 70 ? '🎉 Excellent performance!' : '💪 Keep practicing!'}
        </p>

        <div className="result-stats">
          <div className="result-stat-item">
            <span className="result-value">{result.correctCount}</span>
            <span className="result-label">Correct</span>
          </div>
          <div className="result-divider" />
          <div className="result-stat-item">
            <span className="result-value">{result.totalQuestions}</span>
            <span className="result-label">Total</span>
          </div>
          <div className="result-divider" />
          <div className="result-stat-item">
            <span className="result-value">{result.scorePercent}%</span>
            <span className="result-label">Score</span>
          </div>
        </div>

        <div className="result-actions">
          <button 
            className="retry-btn"
            onClick={() => {
              setResult(null);
              setShowResults(false);
              setAnswers({});
              setTimeRemaining(1800);
              setTimerActive(true);
              setCurrentPage(1);
            }}
          >
            <Rocket size={16} />
            Retry Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="aptitude-quiz">
      <div className="quiz-header">
        <div className="quiz-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="progress-text">{Object.keys(answers).length}/{questions.length}</span>
        </div>
        <div className="quiz-timer">
          <Timer size={16} />
          <span className={timeRemaining < 300 ? 'timer-warning' : ''}>
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>

      <div className="quiz-questions-list">
        {getPaginatedQuestions().map((q, idx) => {
          const globalIdx = (currentPage - 1) * questionsPerPage + idx;
          return (
            <div key={q.id} className="quiz-question-item">
              <div className="q-header">
                <span>Question {globalIdx + 1} of {questions.length}</span>
                {answers[q.id] !== undefined && (
                  <CheckCircle size={14} className="answered-icon" />
                )}
              </div>
              <p className="q-text">{q.question}</p>
              
              <div className="options-list">
                {q.options.map((opt, i) => (
                  <label key={i} className={`option-label ${answers[q.id] === i ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      checked={answers[q.id] === i}
                      onChange={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
                    />
                    <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="quiz-pagination">
        <Pagination 
          currentPage={currentPage}
          totalPages={Math.ceil(questions.length / questionsPerPage)}
          onPageChange={setCurrentPage}
        />
      </div>

      {error && (
        <div className="quiz-error">
          <XCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="quiz-actions">
        <button 
          className="submit-btn"
          disabled={submitting || !allAnswered}
          onClick={handleSubmit}
        >
          {submitting ? (
            <>
              <Loader2 size={18} className="spinning" />
              Submitting...
            </>
          ) : (
            <>
              <Zap size={18} />
              Submit All Answers ({Object.keys(answers).length}/{questions.length})
            </>
          )}
        </button>
        {!allAnswered && (
          <span className="remaining-hint">
            {questions.length - Object.keys(answers).length} questions remaining
          </span>
        )}
      </div>
    </div>
  );
}

// ============================================
// PLACEMENT DETAIL COMPONENT
// ============================================
export function PlacementDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedAnswers, setExpandedAnswers] = useState({});
  const [bookmarks, setBookmarks] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const online = useOnlineStatus();
  const questionsPerPage = 10;

  useEffect(() => {
    const stored = localStorage.getItem('cq_user');
    const user = stored ? JSON.parse(stored) : null;
    setCurrentUser(user);

    // Simulate API call
    const mockCompanies = [
      { id: 1, name: 'Google', slug: 'google', difficulty: 'hard', salaryRange: '$120K - $200K', duration: '3-4 hours', available: true, pattern: 'Technical Interviews (4 rounds) + System Design + Behavioral', syllabus: { 'Data Structures': ['Arrays', 'Linked Lists', 'Trees', 'Graphs', 'Hash Tables'], 'Algorithms': ['Sorting', 'Searching', 'Dynamic Programming', 'Greedy'], 'System Design': ['Scalability', 'Load Balancing', 'Caching', 'Database Design'] } },
      { id: 2, name: 'Microsoft', slug: 'microsoft', difficulty: 'medium', salaryRange: '$110K - $180K', duration: '2-3 hours', available: true, pattern: 'Technical Interviews (3-4 rounds) + Hiring Manager + HR', syllabus: { 'Data Structures': ['Arrays', 'Trees', 'Graphs'], 'Algorithms': ['Sorting', 'Searching', 'Recursion'], 'OOP': ['Classes', 'Inheritance', 'Polymorphism', 'Encapsulation'] } },
      { id: 3, name: 'Amazon', slug: 'amazon', difficulty: 'hard', salaryRange: '$130K - $210K', duration: '3-4 hours', available: true, pattern: 'Technical Interviews + Leadership Principles + System Design', syllabus: { 'Algorithms': ['Sorting', 'Searching', 'Graphs'], 'System Design': ['Scalability', 'Distributed Systems'], 'Leadership': ['STAR Method', 'Amazon Leadership Principles'] } },
      { id: 4, name: 'Meta', slug: 'meta', difficulty: 'hard', salaryRange: '$125K - $205K', duration: '3 hours', available: true, pattern: 'Technical Interviews + Product Design + Behavioral', syllabus: { 'Frontend': ['React', 'JavaScript', 'CSS'], 'Algorithms': ['Data Structures', 'Problem Solving'], 'System Design': ['Architecture', 'Scalability'] } },
      { id: 5, name: 'Apple', slug: 'apple', difficulty: 'medium', salaryRange: '$115K - $195K', duration: '2-3 hours', available: true, pattern: 'Technical Interviews + Design + Culture Fit', syllabus: { 'iOS': ['Swift', 'UIKit', 'SwiftUI'], 'Design Patterns': ['MVC', 'MVVM', 'Singleton'], 'Performance': ['Memory Management', 'Optimization'] } },
    ];

    const found = mockCompanies.find(c => c.slug === slug);
    if (found) {
      const questions = generateQuestionsForCompany(found.name, found.difficulty);
      setCompany({ ...found, questions });
    }
    setLoading(false);
  }, [slug]);

  if (loading) return <LoadingSpinner />;
  if (!online) {
  return (
    <div className="dash-shell">
      <Sidebar
        userData={currentUser}
        isMobile={true}
        onClose={() => setMobileMenuOpen(false)}
        className={mobileMenuOpen ? "open" : ""}
      />

      <div className="dash-content">
        <main className="dash-main">
          <OfflineNotice label="Placement Practice" />
        </main>
      </div>
    </div>
  );
}
  if (!company) return <div className="error-state">Company not found</div>;

  const aptitudeQuestions = company.questions?.filter((q) => q.type === 'aptitude') || [];
  const otherQuestions = company.questions?.filter((q) => q.type !== 'aptitude') || [];

  const toggleAnswer = (index) => {
    setExpandedAnswers(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleBookmark = (index) => {
    setBookmarks(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const filteredOtherQuestions = otherQuestions.filter(q => {
    const matchSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        q.topic?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = filterType === 'all' || q.type === filterType;
    const matchDifficulty = filterDifficulty === 'all' || q.difficulty === filterDifficulty;
    return matchSearch && matchType && matchDifficulty;
  });

  const paginatedQuestions = filteredOtherQuestions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  return (
    <div className="placement-detail-wrapper dash-shell">
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

      <div className="dash-content placement-detail">
        <button className="back-btn" onClick={() => navigate('/placement')}>
          <ArrowLeft size={18} />
          Back to Companies
        </button>

        <div className="company-hero">
          <div className="hero-content">
            <div className="hero-left">
              <div className="hero-icon">
                <Building2 size={36} />
              </div>
              <div>
                <h1>{company.name}</h1>
                <p>{company.salaryRange || 'Competitive Salary Package'}</p>
              </div>
            </div>
            
            <div className="hero-right">
              <div className="hero-stat">
                <Clock size={16} />
                <span>{company.duration || '2-3 hours'}</span>
              </div>
              <div className="hero-stat">
                <Award size={16} />
                <span>{company.questions?.length || 0} Questions</span>
              </div>
              <div className="hero-stat">
                <TrendingUp size={16} />
                <span className={`difficulty-${company.difficulty}`}>
                  {company.difficulty?.toUpperCase() || 'MEDIUM'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-tabs">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <BookOpen size={16} />
            Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'practice' ? 'active' : ''}`}
            onClick={() => setActiveTab('practice')}
          >
            <Target size={16} />
            Practice ({company.questions?.length || 0})
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && (
            <>
              {company.pattern && (
                <section className="detail-section">
                  <div className="section-header">
                    <h3>📋 Exam Pattern</h3>
                    <span className="badge-important">Important</span>
                  </div>
                  <div className="pattern-box">
                    <p>{company.pattern}</p>
                  </div>
                </section>
              )}

              {company.syllabus && (
                <section className="detail-section">
                  <h3>📚 Syllabus</h3>
                  <div className="syllabus-grid">
                    {Object.entries(company.syllabus).map(([section, topics]) => (
                      <div key={section} className="syllabus-card">
                        <h4>{section}</h4>
                        <ul>
                          {topics.map((t, i) => (
                            <li key={i}>{t}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section className="detail-section">
                <h3>💡 Preparation Tips</h3>
                <div className="tips-grid">
                  <div className="tip-card">
                    <div className="tip-icon"><Brain size={20} /></div>
                    <h4>Practice Daily</h4>
                    <p>Solve at least 5-10 problems daily to build consistency</p>
                  </div>
                  <div className="tip-card">
                    <div className="tip-icon"><Clock size={20} /></div>
                    <h4>Time Management</h4>
                    <p>Practice with timers to improve speed and accuracy</p>
                  </div>
                  <div className="tip-card">
                    <div className="tip-icon"><Rocket size={20} /></div>
                    <h4>Mock Interviews</h4>
                    <p>Simulate real interview conditions for better preparation</p>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeTab === 'practice' && (
            <section className="detail-section">
              <div className="practice-header">
                <h3>Practice Questions</h3>
                <span className="q-count">{company.questions?.length || 0} questions</span>
              </div>

              {aptitudeQuestions.length > 0 && (
                <div className="practice-subsection">
                  <div className="subsection-header">
                    <Brain size={18} />
                    <h4>Aptitude Assessment</h4>
                    <span className="sub-badge scored">Scored</span>
                    <span className="question-count">{aptitudeQuestions.length} questions</span>
                  </div>
                  <AptitudeQuiz slug={slug} questions={aptitudeQuestions} />
                </div>
              )}

              {otherQuestions.length > 0 && (
                <div className="practice-subsection">
                  <div className="subsection-header">
                    <BookOpen size={18} />
                    <h4>Additional Questions</h4>
                    <span className="sub-badge review">Review</span>
                  </div>

                  <div className="practice-filters">
                    <div className="search-box small">
                      <Search size={16} />
                      <input 
                        type="text" 
                        placeholder="Search questions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <select 
                      className="filter-select"
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                    >
                      <option value="all">All Types</option>
                      <option value="coding">Coding</option>
                      <option value="logical-reasoning">Logical</option>
                      <option value="hr">HR</option>
                    </select>
                    <select 
                      className="filter-select"
                      value={filterDifficulty}
                      onChange={(e) => setFilterDifficulty(e.target.value)}
                    >
                      <option value="all">All Difficulties</option>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                  
                  <div className="questions-list">
                    {paginatedQuestions.map((q, idx) => {
                      const globalIdx = filteredOtherQuestions.indexOf(q);
                      return (
                        <QuestionCard 
                          key={q.id}
                          question={q}
                          index={globalIdx}
                          showAnswer={expandedAnswers[globalIdx]}
                          onToggleAnswer={toggleAnswer}
                          onBookmark={toggleBookmark}
                          isBookmarked={bookmarks[globalIdx]}
                        />
                      );
                    })}
                  </div>

                  {filteredOtherQuestions.length > questionsPerPage && (
                    <div className="pagination-wrapper">
                      <Pagination 
                        currentPage={currentPage}
                        totalPages={Math.ceil(filteredOtherQuestions.length / questionsPerPage)}
                        onPageChange={setCurrentPage}
                      />
                      <span className="pagination-info">
                        Showing {Math.min((currentPage - 1) * questionsPerPage + 1, filteredOtherQuestions.length)} - {Math.min(currentPage * questionsPerPage, filteredOtherQuestions.length)} of {filteredOtherQuestions.length}
                      </span>
                    </div>
                  )}

                  {filteredOtherQuestions.length === 0 && (
                    <div className="no-questions">
                      <AlertCircle size={32} />
                      <p>No questions match your filters</p>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}