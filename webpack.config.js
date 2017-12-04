//webpack.config.js
"use strict";
const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require ("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require ("html-webpack-plugin");
const CleanWebpackPlugin = require ("clean-webpack-plugin");

module.exports = {
  entry: {index: "./src/index.js"},
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [{
      test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
      loader: "file-loader",
      options: {name: "font/[name].[ext]"}
    },
    {
      test: /\.(png|svg|jpg|gif|ico|jpeg)$/,
      loader: "file-loader",
      options: {name: "img/[name].[ext]"}
    },
    {
      test: /\.html$/,
      loader: "html-loader"
    },
    {
      test: /\.pug$/,
      loader: "pug-loader"
    },
    {
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: ["css-loader", "resolve-url-loader", "sass-loader"]
      })
    }]
  },
  plugins: [
    new ExtractTextPlugin("[name].style.css"),
    new HtmlWebpackPlugin({filename: "index.html", template: "./src/index.pug"}),
    new HtmlWebpackPlugin({filename: "404.html", template: "./src/404.pug"}),
    new CleanWebpackPlugin(["dist"]),
    new webpack.ProvidePlugin({
      $: "jquery",
      jquery: "jquery",
      "window.jquery": "jquery",
      Popper: ["popper.js", "default"]
    })
  ]
};