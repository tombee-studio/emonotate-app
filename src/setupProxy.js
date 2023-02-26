const {createProxyMiddleware} = require("http-proxy-middleware");
const cors = require("cors");

module.exports = app => {
    const staging = process.env.REACT_APP_STAGING || "prod";
    var targetUrl = "";
    if(staging == "local") {
        targetUrl = "http://127.0.0.1:8000/";
    } else if(staging == "alpha") {
        targetUrl = "https://enigmatic-thicket-08912.herokuapp.com/";
    } else if(staging == "prod") {
        if("K_SERVICE" in process.env) {
            targetUrl = "https://emonotate-service-backend-b7ramgi3ga-an.a.run.app/";
        } else {
            targetUrl = "https://www.emonotate.com/";
        }
    } else {
        throw `環境変数 STAGING: ${process.env.STAGING}に設定されています`;
    }
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
