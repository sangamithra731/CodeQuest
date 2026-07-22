const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const TRACKS = [
  {
    slug: "it-field-engineering",
    name: "IT Field Engineering",
    summary:
      "You're the person who physically goes to a client site (bank branch, retail store, office, telecom tower) " +
      "to fix network issues, install hardware, maintain servers, or support end-users. It's hands-on, not coding-heavy.",
    skills: [
      {
        title: "Networking (the backbone of this job)",
        points: [
          "OSI Model (7 layers) — Physical, Data Link, Network, Transport, Session, Presentation, Application",
          "TCP/IP model — how data actually travels practically",
          "IP addressing & Subnetting — Classes A/B/C, subnet masks, CIDR notation (must calculate subnets manually)",
          "DHCP — how a device gets an IP automatically",
          "DNS — how domain names resolve to IPs",
          "Routing & Switching basics — static vs dynamic routing, VLAN concept, switch vs hub vs router",
          "Wi-Fi/Wireless — access point configuration, signal troubleshooting",
        ],
      },
      {
        title: "Hardware Knowledge",
        points: [
          "Assembling/disassembling desktops and laptops",
          "Diagnosing BSOD, POST errors, boot failures",
          "Printer/scanner/POS machine troubleshooting",
          "Server hardware basics — RAID configurations, hot-swappable drives",
          "CCTV, biometric attendance devices",
        ],
      },
      {
        title: "Operating Systems",
        points: [
          "Windows: Active Directory basics, Group Policy, user account management, patch/update management",
          "Linux: basic commands (ls, cd, chmod, systemctl), file permissions, service restarts",
          "OS installation and driver troubleshooting from scratch",
        ],
      },
      {
        title: "ITIL & Process Knowledge",
        points: [
          "Incident Management — how a ticket is raised, worked, and closed",
          "Problem Management — root cause analysis (RCA)",
          "Change Management — how updates/changes get approved and deployed",
          "SLA — how fast you must resolve issues",
        ],
      },
      {
        title: "Soft Skills (heavily weighted here, unlike coding roles)",
        points: [
          "Client communication — often the only technical person a non-technical client sees",
          "Documentation — clear call logs and RCA reports",
          "Time management across multiple site visits",
          "Willingness to travel/shift work",
        ],
      },
    ],
    certifications: [
      "CCNA (Cisco Certified Network Associate) — the single most valuable cert for this field",
      "CompTIA A+ — hardware fundamentals",
      "CompTIA Network+ — networking fundamentals",
      "ITIL Foundation — process knowledge certification",
      "Microsoft MD-100/MD-101 — Windows desktop administration",
    ],
    companyTable: [
      { company: "TCS / Wipro / HCL", emphasis: "Networking + OS + ITIL, moderate technical depth, heavy on communication" },
      { company: "IBM India", emphasis: "Server hardware + networking + structured ITIL process" },
      { company: "Nokia / Ericsson", emphasis: "Deep telecom networking, BTS/tower knowledge, routing/switching" },
      { company: "Jio / Airtel (via vendors)", emphasis: "Fiber, cabling, mobile network basics" },
      { company: "Dell / HP / Lenovo", emphasis: "Hardware repair specialization, OS reinstall, warranty processes" },
    ],
    sampleQuestions: [
      "Walk me through troubleshooting a laptop that won't boot.",
      "A client's Wi-Fi keeps dropping — what steps do you take?",
      "Explain subnetting with an example.",
      "What's the difference between TCP and UDP?",
      "How do you handle a client who's angry about a delayed ticket?",
    ],
  },
  {
    slug: "software-development",
    name: "Software Development (SDE roles)",
    summary:
      "You write code — building applications, backend systems, or infrastructure. Interviews are algorithm and system-design heavy.",
    skills: [
      {
        title: "Data Structures & Algorithms (DSA) — core patterns you must know cold",
        points: [
          "Arrays & Strings (two pointers, sliding window)",
          "Linked Lists (reversal, cycle detection)",
          "Stacks & Queues",
          "Trees & Binary Search Trees (traversals, balanced trees)",
          "Graphs (BFS, DFS, shortest path — Dijkstra)",
          "Dynamic Programming (knapsack, LCS, subsequence problems)",
          "Heaps/Priority Queues",
          "Tries",
          "Backtracking (permutations, combinations, N-Queens style problems)",
        ],
      },
      {
        title: "Object-Oriented Design (OOD)",
        points: [
          "Four pillars: Encapsulation, Abstraction, Inheritance, Polymorphism",
          "SOLID principles",
          "Design patterns (Singleton, Factory, Observer, Strategy) — asked at mid-to-senior level",
        ],
      },
      {
        title: "System Design (for 2+ years experience, sometimes even freshers at top companies)",
        points: [
          "Load balancing",
          "Caching (Redis, CDN concepts)",
          "Database sharding & replication",
          "Message queues (Kafka, RabbitMQ)",
          "CAP theorem",
          "Designing systems like 'design Twitter,' 'design a URL shortener,' 'design a rate limiter'",
        ],
      },
      {
        title: "Databases",
        points: [
          "SQL — joins, indexing, normalization, query optimization, window functions",
          "NoSQL — when to use MongoDB/Cassandra vs relational DBs",
        ],
      },
      {
        title: "Core CS Fundamentals",
        points: [
          "Operating Systems — processes vs threads, deadlocks, memory management, paging",
          "Computer Networks — TCP/IP, HTTP/HTTPS, DNS",
        ],
      },
      {
        title: "One language mastered deeply",
        points: [
          "Pick one: Java, Python, C++, or JavaScript/Node",
          "Know its internals — memory management, collections/data structure implementations, concurrency basics",
        ],
      },
    ],
    certifications: [],
    companyTable: [
      { company: "TCS / Infosys / Wipro (dev roles)", focus: "Basic coding + aptitude + SQL", problems: "50–100 (easy-medium)" },
      { company: "Cognizant / Capgemini / Accenture", focus: "Coding fundamentals + communication", problems: "50–100 (easy-medium)" },
      { company: "Amazon India", focus: "DSA + system design (SDE2+) + leadership principles", problems: "250–350 (medium-hard)" },
      { company: "Google India", focus: "Very strong DSA + CS fundamentals", problems: "300+ (medium-hard)" },
      { company: "Microsoft India", focus: "DSA + OOD + system design", problems: "200–300 (medium-hard)" },
      { company: "Flipkart", focus: "DSA + system design + SQL", problems: "200–300 (medium-hard)" },
      { company: "Adobe", focus: "DSA + OOD + product thinking", problems: "200–250 (medium-hard)" },
      { company: "Swiggy / Zomato / PhonePe / CRED", focus: "DSA + system design + practical problem-solving", problems: "150–250 (medium-hard)" },
      { company: "Atlassian", focus: "DSA + collaborative/pair coding rounds", problems: "200+ (medium-hard)" },
    ],
    sampleQuestions: [
      "Reverse a linked list (in-place)",
      "Find the longest substring without repeating characters",
      "Design a URL shortener (system design)",
      "Explain normalization in databases with an example",
      "Difference between process and thread",
    ],
  },
];

async function main() {
  for (const t of TRACKS) {
    await prisma.skillTrack.upsert({
      where: { slug: t.slug },
      update: {
        name: t.name,
        summary: t.summary,
        skills: t.skills,
        certifications: t.certifications,
        companyTable: t.companyTable,
        sampleQuestions: t.sampleQuestions,
      },
      create: {
        slug: t.slug,
        name: t.name,
        summary: t.summary,
        skills: t.skills,
        certifications: t.certifications,
        companyTable: t.companyTable,
        sampleQuestions: t.sampleQuestions,
      },
    });
    console.log(`Seeded track: ${t.name}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());