const path = require('path');
const { kill } = require('process');
const { VueLoaderPlugin } = require('vue-loader')
const { DefinePlugin } = require('webpack')

module.exports = {
  entry: './src/application.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'application.js'
  },
  mode: "development",
  devtool: "inline-source-map",
  watch: true,
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          hotReload: false, // disables Hot Reload
          customElement: true,
          compilerOptions: {
            isCustomElement: tag => {
              return true
            }
          },
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new DefinePlugin({
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true,
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false
    })
  ],
  devServer: {
    static: {
        directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9001
  }
};
