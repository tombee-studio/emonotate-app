const {createProxyMiddleware} = require("http-proxy-middleware")

module.exports = app => {
    if(process.env.STAGING == "local") {
        app.use("/api/", createProxyMiddleware({
            target: "http://127.0.0.1:8000/",
            changeOrigin: true
        }));
    } else if(process.env.STAGING == "alpha") {
        app.use("/api/", createProxyMiddleware({
            target: "https://enigmatic-thicket-08912.herokuapp.com/",
            changeOrigin: true
        }));
    } else if(process.env.STAGING == "prod") {
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
