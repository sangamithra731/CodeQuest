const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const companies = [
  {
    slug: "tcs",
    name: "TCS",
    salaryRange: "₹3.5 LPA – ₹7 LPA",
    pattern:
      "TCS NQT (National Qualifier Test) has three sections: Foundation (aptitude + verbal + reasoning), Advanced (coding, 1-2 problems), and optional Advanced Coding for specialist roles. Total duration ~2.5 hours. Cutoffs vary by section — you must clear each section individually, not just the overall average.",
    syllabus: {
      "Quantitative Aptitude": ["Percentages", "Profit & Loss", "Time & Work", "Permutations & Combinations", "Probability"],
      "Verbal Ability": ["Reading comprehension", "Sentence correction", "Synonyms/Antonyms", "Para jumbles"],
      "Logical Reasoning": ["Blood relations", "Coding-decoding", "Syllogisms", "Seating arrangement"],
      "Coding": ["Basic programming (loops, arrays, strings)", "One easy-medium DSA problem"],
    },
    available: true,
    questions: [
      {
        type: "aptitude",
        question: "A shopkeeper marks up an item by 25% and then gives a discount of 20%. What is the net gain/loss percentage?",
        options: ["No gain no loss", "Gain of 5%", "Loss of 5%", "Gain of 10%"],
        correctIndex: 2,
        difficulty: "Medium",
      },
      {
        type: "aptitude",
        question: "If A can complete a task in 12 days and B in 18 days, how many days will they take working together?",
        options: ["6 days", "7.2 days", "9 days", "10 days"],
        correctIndex: 1,
        difficulty: "Medium",
      },
      {
        type: "aptitude",
        question: "Find the next number in the series: 3, 7, 15, 31, __",
        options: ["47", "63", "62", "56"],
        correctIndex: 1,
        difficulty: "Medium",
      },
      {
        type: "coding",
        question: "Write a function to check if a given string is a palindrome.",
        answer:
          "Compare the string with its reverse. In Python: return s == s[::-1]. In most languages, use two pointers from both ends moving inward, comparing characters until they meet.",
        difficulty: "Easy",
      },
      {
        type: "hr",
        question: "Why do you want to join TCS?",
        answer:
          "Focus on genuine reasons: scale of projects, learning opportunities, stability, and alignment between your skills and the role. Avoid generic answers — mention something specific about TCS (its digital transformation projects, global presence, or training programs like TCS iON).",
        difficulty: "Easy",
      },
    ],
  },
  {
    slug: "infosys",
    name: "Infosys",
    salaryRange: "₹3.6 LPA – ₹9.5 LPA (Digital Specialist)",
    pattern:
      "Infosys InfyTQ / on-campus test has sections on Aptitude, Logical Reasoning, Verbal, and Pseudocode/Coding. The Pseudocode section is unique to Infosys — you read pseudocode and predict output rather than writing code from scratch in the first round.",
    syllabus: {
      "Quantitative Aptitude": ["Ratios & Proportions", "Time, Speed & Distance", "Simple & Compound Interest", "Averages"],
      "Logical Reasoning": ["Data sufficiency", "Puzzles", "Number series", "Direction sense"],
      "Pseudocode": ["Loop tracing", "Array manipulation logic", "Recursion tracing"],
      "Verbal": ["Grammar", "Comprehension", "Error spotting"],
    },
    available: true,
    questions: [
      {
        type: "aptitude",
        question: "A train travels 360 km in 4 hours. What is its speed in m/s?",
        options: ["20 m/s", "25 m/s", "30 m/s", "36 m/s"],
        correctIndex: 1,
        difficulty: "Easy",
      },
      {
        type: "aptitude",
        question: "The average of 5 numbers is 20. If one number is removed, the average becomes 18. What is the removed number?",
        options: ["24", "28", "32", "20"],
        correctIndex: 1,
        difficulty: "Medium",
      },
      {
        type: "aptitude",
        question:
          "Pseudocode: for i = 1 to 5: sum = sum + i. If sum starts at 0, what is the final value of sum?",
        options: ["10", "15", "20", "5"],
        correctIndex: 1,
        difficulty: "Easy",
      },
      {
        type: "coding",
        question: "Explain how you would find the second largest element in an array without sorting it.",
        answer:
          "Traverse the array once, tracking two variables: largest and secondLargest. For each element, if it's greater than largest, shift largest into secondLargest, then update largest. Else if it's greater than secondLargest (and not equal to largest), update secondLargest. This runs in O(n) time.",
        difficulty: "Medium",
      },
      {
        type: "hr",
        question: "Are you willing to relocate for this role?",
        answer:
          "Answer honestly, but frame flexibility positively if you are open to it — Infosys often places freshers at specific development centers (Mysore, Pune, Chennai, etc.) and directly asks this to gauge willingness before extending an offer.",
        difficulty: "Easy",
      },
    ],
  },
  {
    slug: "amazon-india",
    name: "Amazon India",
    salaryRange: "₹18 LPA – ₹28 LPA (SDE-1, varies by campus tier)",
    pattern:
      "Amazon's process is DSA-heavy from round one: usually 2 online coding rounds (2 problems each, medium-hard) followed by 2-4 in-person/virtual rounds combining DSA, system design (for SDE-2+), and Leadership Principles behavioral questions. Every round, including technical ones, has an LP component.",
    syllabus: {
      "Data Structures & Algorithms": ["Arrays & Strings", "Trees & Graphs", "Dynamic Programming", "Heaps", "Sliding Window"],
      "System Design": ["Scalability basics", "Load balancing", "Caching", "Database choices (for SDE-2+)"],
      "Leadership Principles": ["Customer Obsession", "Ownership", "Bias for Action", "Deliver Results"],
    },
    available: true,
    questions: [
      {
        type: "aptitude",
        question:
          "What is the time complexity of finding an element in a balanced Binary Search Tree?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctIndex: 1,
        difficulty: "Easy",
      },
      {
        type: "aptitude",
        question: "Which data structure is most suitable for implementing a priority queue efficiently?",
        options: ["Array", "Linked List", "Heap", "Stack"],
        correctIndex: 2,
        difficulty: "Medium",
      },
      {
        type: "coding",
        question: "Given an array of integers, find two numbers that add up to a target value.",
        answer:
          "Use a hash map: iterate through the array, for each number check if (target - number) already exists in the map. If yes, return the pair. If no, add the current number to the map. This achieves O(n) time instead of the O(n²) brute-force nested loop.",
        difficulty: "Medium",
      },
      {
        type: "coding",
        question: "How would you detect a cycle in a linked list?",
        answer:
          "Use Floyd's Cycle Detection (slow and fast pointers). Move slow one step and fast two steps at a time. If they ever meet, there's a cycle. If fast reaches null, there's no cycle. This runs in O(n) time and O(1) space.",
        difficulty: "Medium",
      },
      {
        type: "hr",
        question: "Tell me about a time you disagreed with a decision made by your team or manager.",
        answer:
          "This maps to Amazon's 'Have Backbone; Disagree and Commit' Leadership Principle. Structure your answer with STAR (Situation, Task, Action, Result): explain the disagreement, how you voiced it respectfully with data/reasoning, and — crucially — how you committed fully once a decision was made, even if it wasn't your preferred outcome.",
        difficulty: "Medium",
      },
    ],
  },
];

async function main() {
  for (const c of companies) {
    const { questions, ...companyData } = c;

    const company = await prisma.company.upsert({
      where: { slug: c.slug },
      update: companyData,
      create: companyData,
    });

    // Clear old questions for this company before re-seeding, so re-runs don't duplicate
    await prisma.placementQuestion.deleteMany({ where: { companyId: company.id } });

    await prisma.placementQuestion.createMany({
      data: questions.map((q, i) => ({
        companyId: company.id,
        type: q.type,
        question: q.question,
        options: q.options || null,
        correctIndex: q.correctIndex ?? null,
        answer: q.answer || null,
        difficulty: q.difficulty,
        order: i,
      })),
    });

    console.log(`Seeded: ${c.name} (${questions.length} questions)`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });