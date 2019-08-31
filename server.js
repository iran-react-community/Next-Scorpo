const urlConfigs = require("./scorpo.config").urlConfigs;
const cacheableResponse = require("cacheable-response");
const port = parseInt(process.env.PORT, 10) || 8585;
const dev = process.env.NODE_ENV !== "production";
const unescape = require("querystring").unescape;
const express = require("express");
const { parse } = require("url");
const next = require("next");
const path = require("path");
const app = next({ dev });
const handle = app.getRequestHandler();
const ssrCache = cacheableResponse({
  ttl: 1000 * 60 * 60, // 1hour
  get: async ({ req, res, pagePath, queryParams }) => ({
    data: await app.renderToHTML(req, res, pagePath, queryParams)
  }),
  send: ({ data, res }) => {
    res.send(data);
  }
});

app.prepare().then(() => {
  const server = express();

  const oneHour = 3600000; // 3600000msec == 1hour

  server.use((req, res, next) => {
    req.url = unescape(req.url);
    next();
  });

  server.get("/service-worker.js", (req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;
    // Don't cache service worker is a best practice (otherwise clients wont get emergency bug fix)
    res.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    res.set("Content-Type", "application/javascript");

    const filePath = path.join(__dirname, ".next", pathname);
    app.serveStatic(req, res, filePath);
  });

  server.get("/static/*", (req, res) => {
    res.set("Cache-Control", "max-age=31536000");
    handle(req, res);
  });

  server.get("/_next/static/css/*", (req, res) => {
    res.set("Cache-Control", "max-age=31536000");
    handle(req, res);
  });

  server.get("*", (req, res) => {
    if (urlConfigs.hasOwnProperty(req.url)) {
      if (urlConfigs[req.url].cache) ssrCache({ req, res, pagePath: req.url });
    } else {
      handle(req, res);
    }
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
