const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 8080; // Or any port you prefer

// Define the target domain or IP
const targetUrl = 'http://172.187.176.177:3030'; // Replace with your target domain or IP

// Set up the proxy middleware
app.use('/', createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    ws: true, // Add this line to support WebSocket
    onProxyReq: (proxyReq, req, res) => {
        // Modify headers if needed
        proxyReq.setHeader('X-Added', 'foobar');
    },
    onError: (err, req, res) => {
        res.status(500).send('Something went wrong.');
    }
}));

app.listen(PORT, () => {
    console.log(`Relay service is running on port ${PORT} and redirecting to ${targetUrl}`);
});
