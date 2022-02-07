const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
const eslintLoader = 'eslint-loader';

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all',
    },
  };

  if (isProd) {
    config.minimizer = [
      // minimize js files
      new TerserWebpackPlugin(),
      // minimize css files
      new CssMinimizerPlugin(),
    ];
  }

  return config;
};

const getFileName = (ext) => (isProd ? `[name].[contenthash].${ext}` : `[name].${ext}`);
const getCssLoaders = (extra) => {
  const loaders = [MiniCssExtractPlugin.loader, 'css-loader'];

  if (extra) {
    loaders.push(extra);
  }

  return loaders;
};
const getBabelOptions = (preset) => {
  const options = {
    presets: ['@babel/preset-env'],
    plugins: [['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }]],
  };

  if (preset) {
    options.presets.push(preset);
  }

  return options;
};

const getJsLoaders = () => {
  const loaders = [{
    loader: 'babel-loader',
    options: getBabelOptions(),
  }];

  if (isDev) {
    loaders.push('eslint-loader');
  }

  return loaders;
};

console.log('resolve', path.resolve(__dirname, 'webpack.config.js'));

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    main: ['@babel/polyfill', './index.jsx'],
    analytics: './analytics.ts',
  },
  output: {
    filename: getFileName('js'),
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    // creates html file with new bundle
    new HtmlWebpackPlugin({
      template: './index.html',
      minify: isProd,
    }),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'src/favicon.ico'), to: path.resolve(__dirname, 'dist') },
        { from: path.resolve(__dirname, 'src/assets/Screenshot.png'), to: path.resolve(__dirname, 'dist') },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: getFileName('css'),
      runtime: false,
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.json', '.jsx'],
    alias: {
      Modules: path.resolve(__dirname, 'src/modules'),
      Assets: path.resolve(__dirname, 'src/assets'),
      Styles: path.resolve(__dirname, 'src/styles'),
      '@': path.resolve(__dirname, 'src'),
    },
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'src'),
    },
    compress: true,
    port: 9000,
  },
  // ALLOW SOURCE MAP
  devtool: isProd ? false : 'source-map',
  optimization: optimization(),
  module: {
    rules: [
      // loads css files
      {
        test: /\.css$/,
        use: getCssLoaders(),
      },
      // ALLOW LESS PREPROCESORS
      {
        test: /\.less$/,
        use: getCssLoaders('less-loader'),
      },
      // ALLOW SASS PREPROCESORS
      {
        test: /\.s[ac]ss$/,
        use: getCssLoaders('sass-loader'),
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      },
      {
        test: /\.(ttf|woff|woff2|eot)/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      },
      {
        test: /\.xml$/,
        loader: 'xml-loader',
      },
      {
        test: /\.csv$/,
        loader: 'csv-loader',
      },
      // ALLOW JAVASCRIPT NEW FEATURES
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: getJsLoaders(),
      },
      // ALLOW TYPESCRIPT
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: getBabelOptions('@babel/preset-typescript'),
        },
      },
      // ALLOW REACT JSX
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: getBabelOptions('@babel/preset-react'),
        }, eslintLoader],
      },
    ],
  },
};
