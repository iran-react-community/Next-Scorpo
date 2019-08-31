import { apiService } from "./api.service";
import { githubSearchApi } from "./api.route";

export const GithubSearchProvider = async query => {
  return await apiService.get(githubSearchApi(query));
};
