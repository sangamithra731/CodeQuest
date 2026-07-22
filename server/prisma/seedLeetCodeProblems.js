// server/prisma/seedLeetCodeProblems.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const problems = [
  { slug: "two-sum", title: "Two Sum", difficulty: "Easy", topic: "Arrays & Hashing",
    description: "Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target. You may assume each input has exactly one solution, and you may not use the same element twice.",
    leetcodeUrl: "https://leetcode.com/problems/two-sum/",
    videoUrl: "https://www.youtube.com/watch?v=KLlXCFG5TnA" },

  { slug: "valid-anagram", title: "Valid Anagram", difficulty: "Easy", topic: "Arrays & Hashing",
    description: "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
    leetcodeUrl: "https://leetcode.com/problems/valid-anagram/",
    videoUrl: "https://www.youtube.com/watch?v=9UtInBqnCgA" },

  { slug: "contains-duplicate", title: "Contains Duplicate", difficulty: "Easy", topic: "Arrays & Hashing",
    description: "Given an integer array nums, return true if any value appears at least twice in the array, and false if every element is distinct.",
    leetcodeUrl: "https://leetcode.com/problems/contains-duplicate/",
    videoUrl: "https://www.youtube.com/watch?v=3OamzN90kPg" },

  { slug: "valid-parentheses", title: "Valid Parentheses", difficulty: "Easy", topic: "Stack",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/",
    videoUrl: null },

  { slug: "maximum-subarray", title: "Maximum Subarray", difficulty: "Medium", topic: "Dynamic Programming",
    description: "Given an integer array nums, find the subarray with the largest sum, and return that sum.",
    leetcodeUrl: "https://leetcode.com/problems/maximum-subarray/",
    videoUrl: null },

  { slug: "best-time-buy-sell-stock", title: "Best Time to Buy and Sell Stock", difficulty: "Easy", topic: "Arrays & Hashing",
    description: "You are given an array prices where prices[i] is the price of a stock on day i. Maximize your profit by choosing a single day to buy and a different day in the future to sell.",
    leetcodeUrl: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    videoUrl: null },

  { slug: "product-except-self", title: "Product of Array Except Self", difficulty: "Medium", topic: "Arrays & Hashing",
    description: "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all elements of nums except nums[i], without using division.",
    leetcodeUrl: "https://leetcode.com/problems/product-of-array-except-self/",
    videoUrl: null },

  { slug: "climbing-stairs", title: "Climbing Stairs", difficulty: "Easy", topic: "Dynamic Programming",
    description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    leetcodeUrl: "https://leetcode.com/problems/climbing-stairs/",
    videoUrl: null },

  { slug: "reverse-linked-list", title: "Reverse Linked List", difficulty: "Easy", topic: "Linked List",
    description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    leetcodeUrl: "https://leetcode.com/problems/reverse-linked-list/",
    videoUrl: null },

  { slug: "merge-two-sorted-lists", title: "Merge Two Sorted Lists", difficulty: "Easy", topic: "Linked List",
    description: "You are given the heads of two sorted linked lists. Merge the two lists into one sorted list and return its head.",
    leetcodeUrl: "https://leetcode.com/problems/merge-two-sorted-lists/",
    videoUrl: null },

  { slug: "binary-search", title: "Binary Search", difficulty: "Easy", topic: "Binary Search",
    description: "Given a sorted array of integers nums and an integer target, write a function to search target in nums. If it exists, return its index. Otherwise, return -1.",
    leetcodeUrl: "https://leetcode.com/problems/binary-search/",
    videoUrl: null },

  { slug: "group-anagrams", title: "Group Anagrams", difficulty: "Medium", topic: "Arrays & Hashing",
    description: "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
    leetcodeUrl: "https://leetcode.com/problems/group-anagrams/",
    videoUrl: null },

  { slug: "container-with-most-water", title: "Container With Most Water", difficulty: "Medium", topic: "Two Pointers",
    description: "You are given an integer array height. Find two lines that together with the x-axis form a container that holds the most water.",
    leetcodeUrl: "https://leetcode.com/problems/container-with-most-water/",
    videoUrl: null },

  { slug: "longest-substring-no-repeat", title: "Longest Substring Without Repeating Characters", difficulty: "Medium", topic: "Sliding Window",
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    leetcodeUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    videoUrl: null },

  { slug: "search-rotated-sorted-array", title: "Search in Rotated Sorted Array", difficulty: "Medium", topic: "Binary Search",
    description: "There is an integer array nums sorted in ascending order, possibly rotated. Given the array and a target, return its index if found, or -1.",
    leetcodeUrl: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
    videoUrl: null },
];

async function main() {
  for (let i = 0; i < problems.length; i += 1) {
    const data = problems[i];
    const problem = await prisma.problem.upsert({
      where: { slug: data.slug },
      update: { ...data, platform: "leetcode", order: i },
      create: { ...data, platform: "leetcode", order: i },
    });
    console.log(`Seeded: ${problem.title}`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());