const {createProxyMiddleware} = require("http-proxy-middleware");
const cors = require("cors");

module.exports = app => {
    let targetUrl = process.env.REACT_APP_API_URL;
    app.use("/api/**", createProxyMiddleware({
        target: targetUrl,
        changeOrigin: true
    }));
    app.use("/history/**", createProxyMiddleware({
        target: targetUrl,
        changeOrigin: true
    }));
    app.use("/free-hand/**", createProxyMiddleware({
        target: targetUrl,
        changeOrigin: true
    }));
    app.use("/fold-line/**", createProxyMiddleware({
        target: targetUrl,
        changeOrigin: true
    }));
    app.use(cors());
};
