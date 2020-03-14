//webpack.config.js
"use strict";
const path = require("path");
const webpack = require("webpack");
const CleanWebpackPlugin = require ("clean-webpack-plugin");
const MiniCssExtractPlugin = require ("mini-css-extract-plugin");

module.exports = {
  mode: "development",
  entry: {index: "./src/index.js"},
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "public")
  },
  module: {
    rules: [{
      test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
      loader: "file-loader",
      options: {name: "/font/[name].[ext]"}
    },
    {
      test: /\.html$/,
      loader: "html-loader"
    },
    {
      test: /\.scss$/,
      use: [
        MiniCssExtractPlugin.loader, "css-loader", "resolve-url-loader", "sass-loader"
      ]
    }]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "/css/[name].style.css",
    }),
    new CleanWebpackPlugin(
      {
        dry: true,
        cleanOnceBeforeBuildPatterns: ["**/*", "!documents", "!image"]
      }
    ),
    new webpack.ProvidePlugin({
      $: "jquery",
      jquery: "jquery",
      "window.jquery": "jquery",
      Popper: ["popper.js", "default"]
    })
  ]
};