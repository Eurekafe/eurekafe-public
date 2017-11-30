//gulpfile.js
/* eslint no-console: "off" */

"use strict";

var gulp = require("gulp");
var gutil = require("gulp-util");
var nodemon = require("nodemon");
var webpack = require("webpack");
var UglifyJSPlugin = require("uglifyjs-webpack-plugin");

var webpackConfig = require("./webpack.config.js");

gulp.task("default", ["server-dev"]);

gulp.task("build", ["webpack:build-prod"], function(done) {
  done();
});

gulp.task("build-dev", ["webpack:build"], function() {
  gulp.watch(["src/**/*"], ["webpack:build"]);
});


var publicConfig = Object.create(webpackConfig);
publicConfig.devtool = "inline-source-map";

// create a single instance of the compiler to allow caching
var devCompilerPublic = webpack(publicConfig);

gulp.task("webpack:build", function(callback) {
  // run webpack
  devCompilerPublic.run(function(err, stats) {
    if(err) throw new gutil.PluginError("webpack:build", err);
    gutil.log("[webpack:build]", stats.toString({
      colors: true
    }));
    callback();
  });
});


var publicConfigProd = Object.create(webpackConfig);
publicConfigProd.plugins.push(new UglifyJSPlugin());

// create a single instance of the compiler to allow caching
var prodCompilerPublic = webpack(publicConfig);

gulp.task("webpack:build-prod", function(callback) {
  // run webpack
  prodCompilerPublic.run(function(err, stats) {
    if(err) throw new gutil.PluginError("webpack:build-prod", err);
    gutil.log("[webpack:build-prod]", stats.toString({
      colors: true
    }));
    callback();
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

