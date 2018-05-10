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

const url = process.env.MONGO_CRED;
var MongoClient = require("mongodb").MongoClient;
var dbclient = new Promise(function(resolve, reject) {
  MongoClient.connect(url, function(err, client) {
    if (err) {
      console.log("err");
      reject(err);
    }
    else {
      const db = client.db("eurekafe");
      console.log("success");
      resolve(db);
    }
  });
});

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

app.use(express.static("public", {maxAge: 3600000}));

app.post("/newsletter", function(req, res) {
  let newmail = undefined;
  if (req.body.mail) {
    newmail = req.body.mail;
  } else if(req.body.mail2) {
    newmail = req.body.mail2;
  }
  let regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (regex.test(newmail)) {
    var mailOptions = {
      from: process.env.MAIL,
      to: process.env.MAIL_TARGET,
      subject: "inscription newsletter",
      text: newmail
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        res.redirect("/error");
      } else {
        console.log("Email sent: " + info.response);
        res.redirect("/newsletterSuccess");
        dbclient.then(function(dbs) {
          var collection = dbs.collection("newsletter");
          collection.insertOne({email: newmail}, function(err, data) {
            if(err) res.redirect("/error");
            console.log(data);
          });
        });
        
      }
    });
  } else {
    res.redirect("/error");
  }
  
});

app.get("/", function(req,res) {
  res.render("index");
});

app.get("/about", function(req,res) {
  res.render("about");
});

app.get("/faq", function(req,res) {
  res.render("faq");
});

app.get("/legal", function(req,res) {
  res.render("legal");
});

app.get("/press", function(req,res) {
  res.render("press");
});

app.get("/newsletterSuccess", function(req, res) {
  res.sendFile(path.resolve(__dirname, "dist/newsletter.html"));
});

app.use(function(req, res) {
  res.status(404).render("404");
});

const port = process.env.PORT||3000;

app.listen(port, function() {
  console.log("\x1b[32m", "app listening on port", port, "\x1b[0m");
});







