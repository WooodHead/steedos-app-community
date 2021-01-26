const path = require('path');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
// const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.tsx'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.ttf$/,
        use: ['file-loader']
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new MonacoWebpackPlugin({
      languages: ["json", "javascript"],
    }),
    new CopyPlugin({
      patterns: [{
        from: path.join(__dirname, 'public'),
        to: path.resolve(__dirname, path.join('../../public', 'community', 'public'))
      }]
    })
  ],
  // optimization: {
  //   minimize: true,
  //   minimizer: [new TerserPlugin({
  //     terserOptions: {
  //       compress: {
  //         ecma: 2015
  //       }
  //     }
  //   })],
  // },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.html']
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    publicPath: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    hot: true,
    proxy: {
      '/api': 'http://localhost:3000'
    }
  },
  output: {
    filename: '[name].bundle.js',
    publicPath: './',
    path: path.resolve(__dirname, path.join('../../public', 'community'))
  }
};
