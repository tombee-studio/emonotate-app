const {createProxyMiddleware} = require("http-proxy-middleware");
const cors = require("cors");

module.exports = app => {
    const staging = process.env.REACT_APP_STAGING || "prod";
    if(staging == "local") {
        app.use("/api/**", createProxyMiddleware({
            target: "http://127.0.0.1:8000/",
            changeOrigin: true
        }));
        app.use("/history/**", createProxyMiddleware({
            target: "http://127.0.0.1:8000/",
            changeOrigin: true
        }));
        app.use("/free-hand/**", createProxyMiddleware({
            target: "http://127.0.0.1:8000/",
            changeOrigin: true
        }));
        app.use("/fold-line/**", createProxyMiddleware({
            target: "http://127.0.0.1:8000/",
            changeOrigin: true
        }));
    } else if(staging == "alpha") {
        app.use("/api/**", createProxyMiddleware({
            target: "https://enigmatic-thicket-08912.herokuapp.com/",
            changeOrigin: true
        }));
        app.use("/history/**", createProxyMiddleware({
            target: "https://enigmatic-thicket-08912.herokuapp.com/",
            changeOrigin: true
        }));
        app.use("/free-hand/**", createProxyMiddleware({
            target: "https://enigmatic-thicket-08912.herokuapp.com/",
            changeOrigin: true
        }));
        app.use("/fold-line/**", createProxyMiddleware({
            target: "https://enigmatic-thicket-08912.herokuapp.com/",
            changeOrigin: true
        }));
    } else if(staging == "prod") {
        app.use("/api/**", createProxyMiddleware({
            target: "https://www.emonotate.com/",
            changeOrigin: true
        }));
        app.use("/history/**", createProxyMiddleware({
            target: "https://www.emonotate.com/",
            changeOrigin: true
        }));
        app.use("/free-hand/**", createProxyMiddleware({
            target: "https://www.emonotate.com/",
            changeOrigin: true
        }));
        app.use("/fold-line/**", createProxyMiddleware({
            target: "https://www.emonotate.com/",
            changeOrigin: true
        }));
    } else {
        throw `環境変数 STAGING: ${process.env.STAGING}に設定されています`;
    }
    app.use(cors());
};
