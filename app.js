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

app.use(express.static("dist"));

app.post("/newsletter", function(req, res) {
  let newmail = req.body.mail;
  var mailOptions = {
    from: process.env.MAIL,
    to: newmail,
    subject: "Newsletter Eurêkafé",
    text: "Votre inscription à la newsletter a bien étée prise en compte. Cependant cette version du site est toujours en construction et nous n'avons pas mis en place la newsletter. Votre adresse sera donc utilisée une unique fois pour confirmer votre inscription lors de la mise en place de la newsletter. Merci de votre compréhention."
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







