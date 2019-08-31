import { applySnapshot, types } from "mobx-state-tree";
import { GithubStore } from "./github";

let store = null;

const RootStore = types
  .model("RootStore", {
    githubStore: types.optional(GithubStore, {
      data: []
    })
  })
  .views(self => ({}))
  .actions(self => ({}));

export function initializeGithubStore(isServer, snapshot = null) {
  if (isServer) {
    store = RootStore.create();
  }
  if (store === null) {
    store = RootStore.create();
  }
  if (snapshot) {
    applySnapshot(store, snapshot);
  }
  return store;
}
