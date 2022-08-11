export default {
  name: 'coding',
  title: 'Coding Profile',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'codechef',
      title: 'CodeChef Rating',
      type: 'string',
    },
    {
      name: 'geeksforgeeks',
      title: 'GeeksForGeeks Rating',
      type: 'string',
    },
    {
      name: 'leetcode',
      title: 'LeetCode Rating',
      type: 'string',
    },
    {
      name: 'hackerrank',
      title: 'HackerRank Rating',
      type: 'string',
    },
    {
      name: 'codechefProblem',
      title: 'CodeChef Problem',
      type: 'string',
    },
    {
      name: 'geeksforgeeksProblem',
      title: 'GeeksForGeeks Problem',
      type: 'string',
    },
    {
      name: 'leetcodeProblem',
      title: 'LeetCode Problem',
      type: 'string',
    },
    {
      name: 'hackerrankProblem',
      title: 'HackerRank Problem',
      type: 'string',
    },
    {
      name: 'codeforcesProblem',
      title: 'CodeForces Problem',
      type: 'string',
    },
  ],

  preview: {
    select: {
      title: 'title',
    },
  },
}
