const proxy = require('http-proxy-middleware');

module.exports = (app) => {
    // app 是express
    app.use(proxy('/proxyapi', {
        target: "https://hmf.ranyunlong.com",
        changeOrigin: true,
        pathRewrite: {
            '^/proxyapi': "/"
        }
    }))
}