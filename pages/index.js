import "../static/css/index.scss";
import Head from "next/head";
import Nav from "../components/nav";
import { inject, observer } from "mobx-react";

const Home = ({ store }) => (
  <>
    <Head>
      <title>Github Repos</title>
    </Head>
    <Nav />
    <h1>
      <span className="blue">&lt;</span>NextJS
      <span className="blue">&gt;</span> <span className="yellow">Scorpo</span>
    </h1>
    <h2>
      Created with love by{" "}
      <a href="https://github.com/AZIMAT" target="_blank">
        Azim Atefi
      </a>
    </h2>

    <table className="container">
      <thead>
        <tr>
          <th>
            <h1>Repo</h1>
          </th>
          <th>
            <h1>Forks</h1>
          </th>
          <th>
            <h1>Score</h1>
          </th>
          <th>
            <h1>Open Issues</h1>
          </th>
        </tr>
      </thead>
      <tbody>
        {store.githubStore.data.map((item, index) => (
          <tr key={index}>
            <td>{item.name}</td>
            <td>{item.forks}</td>
            <td>{item.score}</td>
            <td>{item.open_issues_count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
);

Home.getInitialProps = async ({ store }) => {
  await store.githubStore.getData("next-js");
};

export default inject("store")(observer(Home));
