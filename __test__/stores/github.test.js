import { GithubStore } from "../../stores/github";

test("Check Github Store Fetching Data", async () => {
  const initialState = { data: [] };
  const githubStore = GithubStore.create(initialState);
  await githubStore.getData();
  expect(githubStore.state == "done").toBe(true);
  expect(githubStore.data.length > 0).toBe(true);
});
