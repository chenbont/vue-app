module.exports = {
    publicPath: '',
    devServer: {
        proxy: { // 配置跨域
            'client': {
                target: 'http://192.168.0.199:9002',
            },
            'amap': {
                target: 'https://restapi.amap.com/v3',
                pathRewrite: {
                    '^/amap': ''
                },
            },
            'qqmap': {
                target: 'https://apis.map.qq.com/ws',
                pathRewrite: {
                    '^/qqmap': ''
                },

            },
        }
    },

    pluginOptions: {
        cordovaPath: 'src-cordova'
    }
}
