//app.js
/* eslint no-console: "off" */


"use strict";
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();
var nodemailer = require("nodemailer");

const path = require("path");

var transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERV,
  auth: {
    user: process.env.MAIL,
    pass: process.env.MAIL_PASSWORD
  }
});

app.use(morgan("tiny"));

app.set("view engine", "pug");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("dist", {maxAge: 3600000}));

app.post("/newsletter", function(req, res) {
  let newmail = undefined;
  if (req.body.mail) {
    newmail = req.body.mail;
  } else if(req.body.mail2) {
    newmail = req.body.mail2;
  }
  var mailOptions = {
    from: process.env.MAIL,
    to: process.env.MAIL_TARGET,
    subject: "inscription newsletter",
    text: newmail
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      res.redirect("/newsletterSuccess");
    }
  });
});

app.get("/newsletterSuccess", function(req, res) {
  res.status(404).sendFile(path.resolve(__dirname, "dist/newsletter.html"));
});

app.use(function(req, res) {
  res.status(404).sendFile(path.resolve(__dirname, "dist/404.html"));
  
});

const port = process.env.PORT||3000;

app.listen(port, function() {
  console.log("\x1b[32m", "app listening on port", port, "\x1b[0m");
});







