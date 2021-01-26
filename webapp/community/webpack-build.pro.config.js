const path = require('path');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
module.exports = {
  mode: 'production',
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
      languages: ["json", "javascript", "graphql", "markdown", "scheme", "yaml", "xml", "yaml", "css", "html", "handlebars", "dockerfile"],
    }),
    new CopyPlugin({
      patterns: [{
        from: path.join(__dirname, 'public'),
        to: path.resolve(__dirname, path.join('../../public', 'community', 'public'))
      }]
    })
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      sourceMap:false,
      extractComments: false,
      terserOptions: {
        ecma: undefined,
        warnings: false,
        parse: {},
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log'],
        },
      }
    })],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.html']
  },
  output: {
    filename: '[name].bundle.js',
    publicPath: './',
    path: path.resolve(__dirname, path.join('../../public', 'community'))
  }
};
