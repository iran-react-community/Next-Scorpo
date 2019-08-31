import React from "react";
import App from "next/app";
import { Provider } from "mobx-react";
import { getSnapshot } from "mobx-state-tree";
import { initializeGithubStore } from "../stores/store";
import { register, unregister } from "next-offline/runtime";

export default class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    //
    // Use getInitialProps as a step in the lifecycle when
    // we can initialize our store
    //
    const isServer = typeof window === "undefined";
    const store = initializeGithubStore(isServer);
    //
    // Check whether the page being rendered by the App has a
    // static getInitialProps method and if so call it
    //
    let pageProps = {};

    ctx.store = store;
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    return {
      store: getSnapshot(store),
      isServer,
      pageProps
    };
  }

  constructor(props) {
    super(props);
    this.store = initializeGithubStore(props.isServer, props.store);
  }

  componentDidMount() {
    register();
  }
  componentWillUnmount() {
    unregister();
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Provider store={this.store}>
        <Component {...pageProps} />
      </Provider>
    );
  }
}
