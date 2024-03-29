module.exports = {
    devServer: {
        https: true,
    },
    pluginOptions: {
        lintStyleOnBuild: true,
    },
    pwa: {
        themeColor: '#4DBA87',
        msTileColor: '#000000',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black',
    },
}
