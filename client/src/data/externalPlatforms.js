// Search links are real, working endpoints where the platform supports
// public search by title. Where no reliable search endpoint exists, the
// link goes to that platform's general practice section instead of a
// guessed deep link that might 404.
export const EXTERNAL_PLATFORMS = [
  { name: 'LeetCode', bestFor: 'Coding interviews, DSA', difficulty: 5, searchUrl: (t) => `https://leetcode.com/problemset/?search=${encodeURIComponent(t)}` },
  { name: 'HackerRank', bestFor: 'Beginners, interview preparation', difficulty: 2, searchUrl: (t) => `https://www.hackerrank.com/search?search=${encodeURIComponent(t)}` },
  { name: 'CodeChef', bestFor: 'Competitive programming', difficulty: 3, searchUrl: () => 'https://www.codechef.com/practice' },
  { name: 'Codeforces', bestFor: 'Advanced competitive programming', difficulty: 5, searchUrl: () => 'https://codeforces.com/problemset' },
  { name: 'GeeksforGeeks', bestFor: 'DSA learning + practice', difficulty: 2, searchUrl: (t) => `https://www.geeksforgeeks.org/?s=${encodeURIComponent(t)}` },
  { name: 'Coding Ninjas', bestFor: 'Structured learning', difficulty: 2, searchUrl: () => 'https://www.naukri.com/code360/problem-list' },
  { name: 'Exercism', bestFor: 'Learning new programming languages', difficulty: 2, searchUrl: () => 'https://exercism.org/tracks' },
  { name: 'Codewars', bestFor: 'Fun coding challenges', difficulty: 3, searchUrl: () => 'https://www.codewars.com/kata/search' },
  { name: 'HackerEarth', bestFor: 'Hiring challenges and contests', difficulty: 3, searchUrl: () => 'https://www.hackerearth.com/practice/' },
  { name: 'AtCoder', bestFor: 'Algorithm contests', difficulty: 4, searchUrl: () => 'https://atcoder.jp/contests/' },
  { name: 'Topcoder', bestFor: 'Competitive programming', difficulty: 4, searchUrl: () => 'https://www.topcoder.com/challenges' },
  { name: 'SPOJ', bestFor: 'Large collection of problems', difficulty: 3, searchUrl: () => 'https://www.spoj.com/problems/classical/' },
  { name: 'Project Euler', bestFor: 'Math + programming', difficulty: 4, searchUrl: () => 'https://projecteuler.net/archives' },
  { name: 'CodingBat', bestFor: 'Java & Python basics', difficulty: 1, searchUrl: () => 'https://codingbat.com/java' },
  { name: 'CodinGame', bestFor: 'Game-based coding practice', difficulty: 3, searchUrl: () => 'https://www.codingame.com/start' },
];

export function stars(n) {
  return '⭐'.repeat(n) + '☆'.repeat(5 - n);
}