// next.config.js
const withOffline = require("next-offline");
const withSass = require("@zeit/next-sass");
module.exports = withOffline(
  withSass({
    /* config options here */
  })
);
