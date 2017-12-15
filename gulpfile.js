//gulpfile.js
/* eslint no-console: "off" */

"use strict";
const fs = require("fs");
var gulp = require("gulp");
var gutil = require("gulp-util");
var nodemon = require("nodemon");
var webpack = require("webpack");
var UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require ("html-webpack-plugin");

var webpackConfig = require("./webpack.config.js");

var devCompilerPublic = new Promise(function(resolve, reject) {
  var publicConfig = Object.create(webpackConfig);
  publicConfig.devtool = "inline-source-map";
  
  fs.readdir("./src", function(err, files) {
    if(err) reject(err);
    var regex = /.pug$/;
    files.forEach(function(filename) {
      if(regex.test(filename)) {
        let template = "./src/" + filename;
        let outputname = filename.slice(0, filename.length - 4) + ".html";
        let htmlWebpackPlugin = new HtmlWebpackPlugin({filename: outputname, template});
        publicConfig.plugins.push(htmlWebpackPlugin);
      }
    });
    resolve(webpack(publicConfig));
  });
});

var prodCompilerPublic = new Promise(function(resolve, reject) {
  var publicConfig = Object.create(webpackConfig);
  publicConfig.plugins.push(new UglifyJSPlugin());
  publicConfig.plugins.push(new OptimizeCssAssetsPlugin({
    cssProcessor: require("cssnano"),
    cssProcessorOptions: { discardComments: { removeAll: true } },
    canPrint: true
  }));
  
  fs.readdir("./src", function(err, files) {
    if(err) reject(err);
    var regex = /.pug$/;
    files.forEach(function(filename) {
      if(regex.test(filename)) {
        let template = "./src/" + filename;
        let outputname = filename.slice(0, filename.length - 4) + ".html";
        let htmlWebpackPlugin = new HtmlWebpackPlugin({filename: outputname, template});
        publicConfig.plugins.push(htmlWebpackPlugin);
      }
    });
    resolve(webpack(publicConfig));
  });
});

gulp.task("default", ["server-dev"]);

gulp.task("build", ["webpack:build-prod"], function(done) {
  done();
});

gulp.task("build-dev", ["webpack:build"], function() {
  gulp.watch(["src/**/*"], ["webpack:build"]);
});

/*
var publicConfig = Object.create(webpackConfig);
publicConfig.devtool = "inline-source-map";

// create a single instance of the compiler to allow caching
var devCompilerPublic = webpack(publicConfig);
*/
gulp.task("webpack:build", function(callback) {
  // run webpack
  devCompilerPublic.then(function(compiler) {
    compiler.run(function(err, stats) {
      if(err) throw new gutil.PluginError("webpack:build", err);
      gutil.log("[webpack:build]", stats.toString({
        colors: true
      }));
      callback();
    });
  }).catch(function(err) {
    throw err;
  });
});

gulp.task("webpack:build-prod", function(callback) {
  // run webpack
  prodCompilerPublic.then(function(compiler) {
    compiler.run(function(err, stats) {
      if(err) throw new gutil.PluginError("webpack:build", err);
      gutil.log("[webpack:build]", stats.toString({
        colors: true
      }));
      callback();
    });
  }).catch(function(err) {
    throw err;
  });
});

gulp.task("server-dev", ["build-dev"], function() {
  // configure nodemon
  nodemon({
    // the script to run the app
    script: "app.js",
    // this listens to changes in any of these files/routes and restarts the application
    watch: ["app.js", "routes/", "lib/", ".env"],
    ext: "js"
  }).on("restart", () => {
    console.log("Change detected... restarting server...");
    gulp.src("server.js");
  });
});

