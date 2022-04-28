const {createProxyMiddleware} = require("http-proxy-middleware")

module.exports = app => {
    if(process.env.envinronment == "development") {
        app.use("/api/", createProxyMiddleware({
            target: "http://127.0.0.1:8000/",
            changeOrigin: true
        }));
    } else if(process.env.environment == "production") {
        app.use("/api/", createProxyMiddleware({
            target: "https://www.emonotate.com/",
            changeOrigin: true
        }));
    } else {
        app.use("/api/", createProxyMiddleware({
            target: "http://127.0.0.1:8000/",
            changeOrigin: true
        }));
    }
};
