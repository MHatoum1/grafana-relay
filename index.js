const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 8080;

// Grafana backend (private)
const targetUrl = 'http://IP:PORT';

app.use(
  '/',
  createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    ws: true,

    onProxyReq: (proxyReq, req, res) => {
      proxyReq.setHeader('Host', 'grafana.alphatrust.ai');
      proxyReq.setHeader('X-Forwarded-Host', 'grafana.alphatrust.ai');
      proxyReq.setHeader('X-Forwarded-Proto', 'https');
      proxyReq.setHeader('X-Forwarded-For', req.ip);
    },

    onProxyReqWs: (proxyReq, req, socket, options, head) => {
      proxyReq.setHeader('Host', 'grafana.alphatrust.ai');
      proxyReq.setHeader('X-Forwarded-Proto', 'https');
    },

    onError: (err, req, res) => {
      console.error(err);
      res.status(500).send('Proxy error');
    }
  })
);

app.listen(PORT, () => {
  console.log(`Grafana relay running at https://grafana.alphatrust.ai`);
});
