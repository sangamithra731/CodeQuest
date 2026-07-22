const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const problems = [
  {
    slug: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Arrays & Hashing",
    description:
      "Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target. You may assume each input has exactly one solution, and you may not use the same element twice.",
    constraints: "2 ≤ nums.length ≤ 10^4 · -10^9 ≤ nums[i] ≤ 10^9 · Only one valid answer exists.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] = 2 + 7 = 9" },
    ],
    starterCode: {
      javascript:
        "// Read input from stdin as JSON: { \"nums\": [...], \"target\": n }\nconst lines = require('fs').readFileSync('/dev/stdin', 'utf8');\nconst { nums, target } = JSON.parse(lines);\n\nfunction twoSum(nums, target) {\n  // write your solution here\n}\n\nconsole.log(JSON.stringify(twoSum(nums, target)));",
      python:
        "import sys, json\ndata = json.loads(sys.stdin.read())\nnums, target = data['nums'], data['target']\n\ndef two_sum(nums, target):\n    # write your solution here\n    pass\n\nprint(json.dumps(two_sum(nums, target)))",
    },
    videoUrl: "https://www.youtube.com/watch?v=KLlXCFG5TnA",
    testCases: [
      { input: '{"nums":[2,7,11,15],"target":9}', expected: "[0,1]", isHidden: false },
      { input: '{"nums":[3,2,4],"target":6}', expected: "[1,2]", isHidden: false },
      { input: '{"nums":[3,3],"target":6}', expected: "[0,1]", isHidden: true },
    ],
  },
  {
    slug: "valid-anagram",
    title: "Valid Anagram",
    difficulty: "Easy",
    topic: "Arrays & Hashing",
    description:
      "Given two strings s and t, return true if t is an anagram of s, and false otherwise. An anagram is a word formed by rearranging the letters of another, using all original letters exactly once.",
    constraints: "1 ≤ s.length, t.length ≤ 5 × 10^4 · s and t consist of lowercase English letters.",
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: "true", explanation: "Same letters, same frequency." },
      { input: 's = "rat", t = "car"', output: "false", explanation: "Different letters." },
    ],
    starterCode: {
      javascript:
        "const lines = require('fs').readFileSync('/dev/stdin', 'utf8');\nconst { s, t } = JSON.parse(lines);\n\nfunction isAnagram(s, t) {\n  // write your solution here\n}\n\nconsole.log(isAnagram(s, t));",
      python:
        "import sys, json\ndata = json.loads(sys.stdin.read())\ns, t = data['s'], data['t']\n\ndef is_anagram(s, t):\n    # write your solution here\n    pass\n\nprint('true' if is_anagram(s, t) else 'false')",
    },
    videoUrl: "https://www.youtube.com/watch?v=9UtInBqnCgA",
    testCases: [
      { input: '{"s":"anagram","t":"nagaram"}', expected: "true", isHidden: false },
      { input: '{"s":"rat","t":"car"}', expected: "false", isHidden: false },
      { input: '{"s":"a","t":"ab"}', expected: "false", isHidden: true },
    ],
  },
  {
    slug: "contains-duplicate",
    title: "Contains Duplicate",
    difficulty: "Easy",
    topic: "Arrays & Hashing",
    description:
      "Given an integer array nums, return true if any value appears at least twice in the array, and false if every element is distinct.",
    constraints: "1 ≤ nums.length ≤ 10^5 · -10^9 ≤ nums[i] ≤ 10^9",
    examples: [{ input: "nums = [1,2,3,1]", output: "true", explanation: "1 appears twice." }],
    starterCode: {
      javascript:
        "const lines = require('fs').readFileSync('/dev/stdin', 'utf8');\nconst { nums } = JSON.parse(lines);\n\nfunction containsDuplicate(nums) {\n  // write your solution here\n}\n\nconsole.log(containsDuplicate(nums));",
      python:
        "import sys, json\ndata = json.loads(sys.stdin.read())\nnums = data['nums']\n\ndef contains_duplicate(nums):\n    # write your solution here\n    pass\n\nprint('true' if contains_duplicate(nums) else 'false')",
    },
    videoUrl: "https://www.youtube.com/watch?v=3OamzN90kPg",
    testCases: [
      { input: '{"nums":[1,2,3,1]}', expected: "true", isHidden: false },
      { input: '{"nums":[1,2,3,4]}', expected: "false", isHidden: false },
      { input: '{"nums":[1,1,1,3,3,4,3,2,4,2]}', expected: "true", isHidden: true },
    ],
  },
  {
    slug: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    topic: "Stack",
    description:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid — every opening bracket must be closed by the same type of bracket, in the correct order.",
    constraints: "1 ≤ s.length ≤ 10^4",
    examples: [{ input: 's = "()[]{}"', output: "true" }],
    starterCode: {
      javascript:
        "const lines = require('fs').readFileSync('/dev/stdin', 'utf8');\nconst { s } = JSON.parse(lines);\n\nfunction isValid(s) {\n  // write your solution here\n}\n\nconsole.log(isValid(s));",
      python:
        "import sys, json\ndata = json.loads(sys.stdin.read())\ns = data['s']\n\ndef is_valid(s):\n    # write your solution here\n    pass\n\nprint('true' if is_valid(s) else 'false')",
    },
    videoUrl: null, // add a real YouTube link here when ready
    testCases: [
      { input: '{"s":"()[]{}"}', expected: "true", isHidden: false },
      { input: '{"s":"(]"}', expected: "false", isHidden: false },
      { input: '{"s":"([)]"}', expected: "false", isHidden: true },
    ],
  },
  {
    slug: "maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    description:
      "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum, and return that sum.",
    constraints: "1 ≤ nums.length ≤ 10^5",
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "[4,-1,2,1] has the largest sum = 6." },
    ],
    starterCode: {
      javascript:
        "const lines = require('fs').readFileSync('/dev/stdin', 'utf8');\nconst { nums } = JSON.parse(lines);\n\nfunction maxSubArray(nums) {\n  // write your solution here\n}\n\nconsole.log(maxSubArray(nums));",
      python:
        "import sys, json\ndata = json.loads(sys.stdin.read())\nnums = data['nums']\n\ndef max_sub_array(nums):\n    # write your solution here\n    pass\n\nprint(max_sub_array(nums))",
    },
    videoUrl: null, // add a real YouTube link here when ready
    testCases: [
      { input: '{"nums":[-2,1,-3,4,-1,2,1,-5,4]}', expected: "6", isHidden: false },
      { input: '{"nums":[1]}', expected: "1", isHidden: false },
      { input: '{"nums":[5,4,-1,7,8]}', expected: "23", isHidden: true },
    ],
  },
];

async function main() {
  for (let i = 0; i < problems.length; i += 1) {
    const { testCases, ...problemData } = problems[i];

    const problem = await prisma.problem.upsert({
      where: { slug: problemData.slug },
      update: { ...problemData, order: i },
      create: { ...problemData, order: i },
    });

    await prisma.testCase.deleteMany({ where: { problemId: problem.id } });
    await prisma.testCase.createMany({
      data: testCases.map((tc, j) => ({ ...tc, problemId: problem.id, order: j })),
    });

    console.log(`Seeded: ${problem.title} (${testCases.length} test cases)`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());