//app.js
/* eslint no-console: "off" */


"use strict";
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();

const path = require("path");

app.use(morgan("tiny"));

app.set("view engine", "pug");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("dist", {maxAge: 3600000}));

app.use(function(req, res) {
  res.status(404).sendFile(path.resolve(__dirname, "dist/404.html"));
});

const port = process.env.PORT||3000;

app.listen(port, function() {
  console.log("\x1b[32m", "app listening on port", port, "\x1b[0m");
});