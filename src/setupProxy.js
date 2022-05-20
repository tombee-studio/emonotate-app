const {createProxyMiddleware} = require("http-proxy-middleware");

module.exports = app => {
    const staging = process.env.REACT_APP_STAGING;
    if(staging == "local") {
        app.use("/api/", createProxyMiddleware({
            target: "http://127.0.0.1:8000/",
            changeOrigin: true
        }));
    } else if(staging == "alpha") {
        app.use("/api/", createProxyMiddleware({
            target: "https://enigmatic-thicket-08912.herokuapp.com/",
            changeOrigin: true
        }));
    } else if(staging == "prod") {
        app.use("/api/", createProxyMiddleware({
            target: "https://www.emonotate.com/",
            changeOrigin: true
        }));
    } else {
        throw `環境変数 STAGING: ${process.env.STAGING}に設定されています`;
    }
};
