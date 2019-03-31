const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true
    }),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: {
            '@layout-header-background': '#fff',
            '@layout-sider-background': '#001529',
            '@menu-dark-bg': '#001529'
        }
    })
)