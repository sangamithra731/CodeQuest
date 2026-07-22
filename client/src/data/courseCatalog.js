// 26 languages metadata — same idea as before, original palette/icons.
// Fully-authored courses (theory/examples/quiz) can be flagged via `full: true`.
// `image` is optional: put a banner file in client/public/course-banners/
// and set image: "/course-banners/<filename>". Leave it out (or empty)
// to fall back to the emoji icon on a gradient background.
export const COURSE_CATALOG = [

{
  id: "python",
  name: "Python",
  icon: "🐍",
  color: "#35e0e0",
  difficulty: "Beginner",
  tagline: "Learn Python from scratch.",
  full: true,
  image: "https://i.pinimg.com/1200x/f8/8a/f0/f88af0ab10d4181e79aa9791b63158d2.jpg",
},

{
  id: "python-intermediate",
  name: "Python Intermediate",
  icon: "🐍",
  color: "#6c63ff",
  difficulty: "Intermediate",
  tagline: "Master advanced Python programming.",
  full: true,
  image: "https://i.pinimg.com/1200x/f8/8a/f0/f88af0ab10d4181e79aa9791b63158d2.jpg",
},
  { id: 'javascript', name: 'JavaScript', icon: '⚡', color: '#ffc857', difficulty: 'Beginner',     tagline: 'Bring the web to life.',               full: true, image: 'https://i.pinimg.com/736x/f4/8f/4e/f48f4e8c9129f1e97a631e680c45c950.jpg' },
  { id: 'html-css',   name: 'HTML', icon: '🎨', color: '#ff6b81', difficulty: 'Beginner',     tagline: 'Structure and style your first pages.', full: true, image: 'https://i.pinimg.com/736x/47/65/fb/4765fb94fa56e591815dba8c43d9c5fb.jpg' },
  { id: 'java',       name: 'Java',       icon: '☕', color: '#8b6bff', difficulty: 'Intermediate', tagline: 'Object-oriented programming.',          image: 'https://i.pinimg.com/1200x/4f/db/76/4fdb760759212d98bebd982b5ed82300.jpg' },
  { id: 'c',          name: 'C',          icon: '🔧', color: '#7ee787', difficulty: 'Intermediate', tagline: 'How computers really work.',            image: ' https://tse1.explicit.bing.net/th/id/OIP.cSw__piDYfJQHiGZ4gPL8AAAAA?cb=thfvnextfalcon4&rs=1&pid=ImgDetMain&o=7&rm=3'},
  { id: 'cpp',        name: 'C++',        icon: '⚙️', color: '#7ee787', difficulty: 'Intermediate', tagline: 'Systems and game programming.',         image: 'https://media.craiyon.com/2025-09-21/xyWqS8IKQ5SYOloepgdz7A.webp' },
  { id: 'csharp',     name: 'C#',         icon: '🎯', color: '#8b6bff', difficulty: 'Intermediate', tagline: 'Apps and games with .NET.',             image: 'https://i.pinimg.com/1200x/80/a7/14/80a714094a4302f6da28868dde3f03cb.jpg' },
  { id: 'go',         name: 'Go',         icon: '🐹', color: '#35e0e0', difficulty: 'Intermediate', tagline: 'Simple, fast backend services.',        image: 'https://i.pinimg.com/1200x/51/80/04/518004f46c3ed799a06c0e8664065530.jpg' },
  { id: 'rust',       name: 'Rust',       icon: '🦀', color: '#ff6b81', difficulty: 'Advanced',     tagline: 'Memory safety, no garbage collector.',  image: 'https://i.pinimg.com/1200x/f9/53/b5/f953b5343fec28e6ac540117e57205ee.jpg' },
  { id: 'ruby',       name: 'Ruby',       icon: '💎', color: '#ff6b81', difficulty: 'Beginner',     tagline: 'Elegant, readable syntax.',             image: 'https://i.pinimg.com/736x/16/5d/c5/165dc5a0649e00007c7abd77aadade99.jpg' },
  { id: 'php',        name: 'PHP',        icon: '🐘', color: '#8b6bff', difficulty: 'Beginner',     tagline: 'Power the server-side web.',            image: 'https://i.pinimg.com/1200x/32/70/0a/32700a6d783ba86e55b23a91d7c53106.jpg' },
  { id: 'swift',      name: 'Swift',      icon: '🕊️', color: '#ffc857', difficulty: 'Intermediate', tagline: 'Native iOS and macOS apps.',            image: 'https://i.pinimg.com/236x/c6/54/39/c6543974c1487a10b7a18d9b7a899bed.jpg' },
  { id: 'kotlin',     name: 'Kotlin',     icon: '🎪', color: '#8b6bff', difficulty: 'Intermediate', tagline: 'Modern Android development.',           image: 'https://i.pinimg.com/736x/ff/20/4e/ff204ee4fb84fe74ffe4b88318a25dea.jpg' },
  { id: 'typescript', name: 'TypeScript', icon: '📘', color: '#35e0e0', difficulty: 'Intermediate', tagline: 'JavaScript with types.',                image: 'https://i.pinimg.com/736x/b6/41/ca/b641ca4f72a2e3a7589503b55cf51f99.jpg' },
  { id: 'sql',        name: 'SQL',        icon: '🗄️', color: '#7ee787', difficulty: 'Beginner',     tagline: 'Query relational databases.',           image: 'https://i.pinimg.com/736x/f2/bd/51/f2bd51c479fab3c9df1eaa2e6b558005.jpg' },
  { id: 'r',          name: 'R',          icon: '📊', color: '#35e0e0', difficulty: 'Intermediate', tagline: 'Statistics and data science.',          image: 'https://i.pinimg.com/1200x/68/c0/2e/68c02e63100ba3d693f8c81e217c714f.jpg' },
  { id: 'scala',      name: 'Scala',      icon: '🔺', color: '#ff6b81', difficulty: 'Advanced',     tagline: 'Functional programming on the JVM.',    image: 'https://i.pinimg.com/1200x/82/c4/e5/82c4e57684fd96ec1587862a8bcfd03e.jpg' },
  { id: 'dart',       name: 'Dart',       icon: '🎯', color: '#35e0e0', difficulty: 'Intermediate', tagline: 'Cross-platform apps with Flutter.',     image: 'https://d6vdma9166ldh.cloudfront.net/media/images/Dart_(1).png' },
  { id: 'perl',       name: 'Perl',       icon: '🐪', color: '#ffc857', difficulty: 'Intermediate', tagline: 'Text processing veteran.',              image: 'https://tse3.mm.bing.net/th/id/OIP.Wxe6-NmgAQ3N8p7CY4xXSwHaDt?cb=thfvnextfalcon4&rs=1&pid=ImgDetMain&o=7&rm=3' },
  { id: 'lua',        name: 'Lua',        icon: '🌙', color: '#8b6bff', difficulty: 'Beginner',     tagline: 'Lightweight game scripting.',           image: 'https://media.istockphoto.com/id/1431876342/photo/lua-programming-language-scripting-programming-language-abstract-background.jpg?b=1&s=170667a&w=0&k=20&c=zVGuKUmtUaOtnaDZfjZ7j-3nL4GMCkoHUEdGzF_m70U=' },
  { id: 'haskell',    name: 'Haskell',    icon: 'λ',  color: '#7ee787', difficulty: 'Advanced',     tagline: 'Pure functional programming.',          image: 'https://i.pinimg.com/1200x/e4/be/8e/e4be8e48c9a507cb305eeb4afc7e1f26.jpg' },
  { id: 'matlab',     name: 'MATLAB',     icon: '📈', color: '#ffc857', difficulty: 'Intermediate', tagline: 'Numerical computing.',                  image: 'https://i.pinimg.com/736x/9c/e2/e6/9ce2e63d4ee361e233734d6d16ea6fda.jpg' },
  { id: 'bash',       name: 'Bash/Shell', icon: '💻', color: '#7ee787', difficulty: 'Beginner',     tagline: 'Automate from the command line.',       image: 'https://i.pinimg.com/736x/b5/e7/e2/b5e7e2b85b2209d9a942749a3af2bfc9.jpg' },
  { id: 'asm',        name: 'Assembly',   icon: '🧩', color: '#ff6b81', difficulty: 'Advanced',     tagline: 'Program the CPU directly.',             image: 'https://www.mhzelectronics.com/wp-content/uploads/2016/02/ASM-Logo.jpg' },
  { id: 'julia',      name: 'Julia',      icon: '🔭', color: '#8b6bff', difficulty: 'Advanced',     tagline: 'High-performance scientific computing.', image: 'https://global.discourse-cdn.com/julialang/optimized/3X/d/f/df05507eb926af9199f908dbce7b0afaaf1a0ef8_2_690x345.png' },
  { id: 'elixir',     name: 'Elixir',     icon: '💧', color: '#35e0e0', difficulty: 'Advanced',     tagline: 'Fault-tolerant, concurrent programs.',  image: 'https://res.cloudinary.com/upwork-cloud/image/upload/c_scale,w_1000/v1709302514/catalog/1762854108987289600/admn650pruit4nzvlzpp.jpg' },
];