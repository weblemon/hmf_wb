const proxy = require('http-proxy-middleware');

// const prod = 'https://webapi.ximaifang.com'

module.exports = (app) => {
    // app 是express
    app.use(proxy('/proxyapi', {
        target: "https://hmf.ranyunlong.com",
        changeOrigin: true,
        // pathRewrite: {
        //     '^/proxyapi': "/proxyapi"
        // }
    }));
    
    app.use(proxy('/qmap', {
        target: "https://apis.map.qq.com",
        changeOrigin: true,
        pathRewrite: {
            '^/qmap': "/"
        }
    }))
}