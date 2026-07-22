const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const COMPANIES = [
  {
    slug: "tcs",
    name: "TCS (NQT)",
    salaryRange: "₹3.36 – ₹9.36 LPA (Ninja / Digital / Prime)",
    available: true,
    pattern:
      "TCS NQT 2026 is a single integrated online test, 190 minutes, 5 sections, 82 questions, no negative marking. " +
      "Foundation (mandatory): Numerical Ability — 20 Qs / 25 min, Verbal Ability — 25 Qs / 25 min, Reasoning Ability — 20 Qs / 25 min. " +
      "Advanced: Advanced Aptitude — 15 Qs / 25 min, Advanced Coding — 2 problems / 90 min. " +
      "Your percentile decides which band you're offered: Ninja (~50-60 percentile), Digital (~65-75 percentile), Prime (80+ percentile). " +
      "Coding languages allowed: C, C++, Java, Python, Perl — you can use a different language per problem. " +
      "No back-navigation between sections once time runs out on that section. Tab-switching causes disqualification. " +
      "Post-test: Technical interview (DSA, OOPS, DBMS, your final-year project), Managerial round, HR round.",
    syllabus: {
      Foundation: ["Numerical Ability", "Verbal Ability", "Reasoning Ability"],
      Advanced: ["Advanced Aptitude", "Advanced Coding (2 problems)"],
      Interview: ["DSA", "OOPS", "DBMS", "Final-year project deep dive", "Managerial fit", "HR/relocation"],
    },
    questions: [
      { type: "aptitude", difficulty: "Easy", question: "A can finish a work in 12 days, B in 15 days. Working together, in how many days will they finish 75% of the work?", options: ["5 days", "5.5 days", "6 days", "6.5 days"], correctIndex: 2 },
      { type: "aptitude", difficulty: "Medium", question: "If the ratio of ages of A and B five years ago was 3:4, and their present ages' ratio is 4:5, what is B's present age?", options: ["20", "25", "30", "35"], correctIndex: 2 },
      { type: "aptitude", difficulty: "Medium", question: "Predict the output: for(i=0;i<5;i++){ if(i==3) continue; printf(\"%d \",i); } — what gets printed?", options: ["0 1 2 3 4", "0 1 2 4", "0 1 2", "1 2 3 4"], correctIndex: 1 },
      { type: "aptitude", difficulty: "Easy", question: "Choose the word most similar in meaning to 'AMBIGUOUS'.", options: ["Clear", "Vague", "Direct", "Certain"], correctIndex: 1 },
      { type: "coding", difficulty: "Medium", question: "Given an array of integers, return the length of the longest subarray whose elements sum to exactly K.", answer: "Use a running-sum + hashmap approach: store the first index each prefix sum is seen, then for each index check if (prefixSum - K) exists in the map. O(n) time, O(n) space." },
      { type: "coding", difficulty: "Medium", question: "Given a string, check if it can be rearranged to form a palindrome.", answer: "Count character frequencies; a rearrangement is possible if at most one character has an odd count (zero for even-length strings)." },
    ],
  },
  {
    slug: "infosys",
    name: "Infosys (InfyTQ / HackWithInfy)",
    salaryRange: "₹3.6 LPA (SE) – ₹9.5–21 LPA (SP / DSE via HackWithInfy)",
    available: true,
    pattern:
      "Two tracks: standard System Engineer (SE) hiring via InfyTQ certification + off-campus test, and the higher-paying " +
      "Digital Specialist Engineer (DSE) / Specialist Programmer (SP) track via HackWithInfy — Infosys's national coding contest. " +
      "SE track: InfyTQ certification exam (aptitude + pseudocode/C output prediction, no negative marking but strict per-section timing) " +
      "followed by a technical + HR interview. " +
      "HackWithInfy 2026: Round 1 — virtual coding contest (individual). Round 2 — face-to-face onsite coding round, harder graph/DP/greedy problems, " +
      "roughly LeetCode medium-hard difficulty. Grand Finale — team-based, multi-day hackathon at the Mysore development center; judged on architecture, " +
      "working code, and ability to articulate design trade-offs, not just raw problem-solving. " +
      "Eligibility for HackWithInfy: pre-final/final year B.E./B.Tech, CGPA ≥ 7.0, requires an approved InfyTQ account first.",
    syllabus: {
      "SE Track": ["InfyTQ aptitude", "Pseudocode / C output prediction", "Technical interview", "HR interview"],
      "HackWithInfy (SP/DSE Track)": ["Round 1: individual coding contest", "Round 2: onsite coding (Graphs, DP, Greedy)", "Grand Finale: team hackathon + architecture review"],
    },
    questions: [
      { type: "aptitude", difficulty: "Easy", question: "Predict the output of a nested loop that modifies an array in place: for(i=0;i<3;i++) for(j=0;j<3;j++) if(i==j) arr[i]+=1; — what changes?", options: ["Every element +1", "Only diagonal elements +1", "Nothing changes", "Only arr[0] +1"], correctIndex: 1 },
      { type: "aptitude", difficulty: "Medium", question: "A does a piece of work in 20 days, B in 30 days. If they work on alternate days starting with A, in how many days is the work finished?", options: ["23", "24", "25", "26"], correctIndex: 1 },
      { type: "coding", difficulty: "Hard", question: "HackWithInfy Round 2 style: Given machines with fixed memory and time capacity, allocate incoming compute tasks to maximize throughput.", answer: "Start with a greedy allocation (e.g. shortest-task-first or best-fit), then optimize using a priority queue to track available machine capacity. Be ready to explain WHY the greedy choice is optimal for the given input distribution — the oral round specifically probes this." },
      { type: "coding", difficulty: "Medium", question: "Given a weighted graph, find the shortest path that visits a required set of checkpoint nodes in any order.", answer: "For small checkpoint sets, run Dijkstra from each checkpoint to build a distance matrix, then solve the resulting TSP-like ordering with bitmask DP." },
      { type: "hr", difficulty: "Easy", question: "Describe a time you had to work with a team member you disagreed with. How did you resolve it?", answer: "Use the STAR method: Situation, Task, Action, Result. Infosys HR rounds specifically weight teamwork and conflict-resolution answers for the Grand Finale team-based format." },
    ],
  },
  {
    slug: "wipro",
    name: "Wipro",
    salaryRange: "Coming soon",
    available: false,
    pattern: "Detailed 2026 pattern not yet verified — check back soon.",
    syllabus: {},
    questions: [],
  },
  {
    slug: "accenture",
    name: "Accenture",
    salaryRange: "Coming soon",
    available: false,
    pattern: "Detailed 2026 pattern not yet verified — check back soon.",
    syllabus: {},
    questions: [],
  },
];

async function main() {
  for (const c of COMPANIES) {
    const company = await prisma.company.upsert({
      where: { slug: c.slug },
      update: {
        name: c.name,
        salaryRange: c.salaryRange,
        pattern: c.pattern,
        syllabus: c.syllabus,
        available: c.available,
      },
      create: {
        slug: c.slug,
        name: c.name,
        salaryRange: c.salaryRange,
        pattern: c.pattern,
        syllabus: c.syllabus,
        available: c.available,
      },
    });

    const existingCount = await prisma.placementQuestion.count({ where: { companyId: company.id } });
    if (existingCount === 0 && c.questions.length > 0) {
      for (let i = 0; i < c.questions.length; i++) {
        const q = c.questions[i];
        await prisma.placementQuestion.create({
          data: {
            companyId: company.id,
            type: q.type,
            question: q.question,
            options: q.options || undefined,
            correctIndex: q.correctIndex ?? undefined,
            answer: q.answer || undefined,
            difficulty: q.difficulty,
            order: i,
          },
        });
      }
    }

    console.log(`Seeded ${c.name} (${c.questions.length} questions)`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());