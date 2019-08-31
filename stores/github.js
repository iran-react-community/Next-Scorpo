import { types, applySnapshot } from "mobx-state-tree";
import { GithubSearchProvider } from "../services/github.service";

const GithubProject = types.model({
  open_issues_count: types.integer,
  score: types.number,
  forks: types.integer,
  name: types.string
});

export const GithubStore = types
  .model({
    data: types.array(GithubProject),
    state: "pending"
  })
  .actions(self => {
    const actions = {
      getData: async query => {
        self.state = "done";
        await GithubSearchProvider(query).then(response => {
          response.data.items.map(item => {
            actions.addItem(item);
          });
        });
      },
      addItem: async item => {
        self.data.push({
          open_issues_count: item.open_issues_count,
          score: item.score,
          forks: item.forks,
          name: item.name
        });
      }
    };
    return actions;
  });
