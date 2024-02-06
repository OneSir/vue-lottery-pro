module.exports = {
    outputDir: 'dist',
    filenameHashing: true,
    chainWebpack: (config) => {
      config.plugin('html').tap((args) => {
        args[0].title = '年终大抽奖';
        return args;
      });
    },
    // https://cli.vuejs.org/zh/config/#lintonsave
    lintOnSave: 'error', // [true, false, 'error', 'warning', 'default']
    publicPath: './', // 线上构建出来是相对路径在demo页才好展示
    configureWebpack: {
      output: {
        filename: './js/[name].[hash].js',
        chunkFilename: './js/[name].[hash].js',
      }
      // 线上允许debugger
      // if (config.mode === 'production') {
      //     config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = false;
      // }
    },
    devServer: {
      port: 8080,
      host: '',
      disableHostCheck: true
    }
};
