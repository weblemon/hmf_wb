const proxy = require('http-proxy-middleware');

module.exports = (app) => {
    // app 是express
    app.use(proxy('/proxyapi', {
        target: "https://webapi.ximaifang.com",
        changeOrigin: true,
        pathRewrite: {
            '^/proxyapi': "/"
        }
    }))
}