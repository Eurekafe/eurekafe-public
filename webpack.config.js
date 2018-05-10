//webpack.config.js
"use strict";
const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require ("extract-text-webpack-plugin");
const CleanWebpackPlugin = require ("clean-webpack-plugin");

module.exports = {
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
      use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: ["css-loader", "resolve-url-loader", "sass-loader"]
      })
    }]
  },
  plugins: [
    new ExtractTextPlugin("/css/[name].style.css"),
    new CleanWebpackPlugin(["public/js", "public/css", "public/font", "dist"]),
    new webpack.ProvidePlugin({
      $: "jquery",
      jquery: "jquery",
      "window.jquery": "jquery",
      Popper: ["popper.js", "default"]
    })
  ]
};