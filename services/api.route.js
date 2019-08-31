export const githubSearchApi = query => {
  return `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc`;
};
