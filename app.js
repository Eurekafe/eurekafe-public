//app.js
/* eslint no-console: "off" */


"use strict";

require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const momentjs = require("moment");
const nodemailer = require("nodemailer");
const MongoClient = require("mongodb").MongoClient;
const Mailchimp = require("mailchimp-api-v3");

const app = express();
const port = process.env.PORT||3000;
const mongoUrl = process.env.MONGO_CRED;
const mailchimpKey = process.env.MAILCHIMP_KEY;

app.get("*", function(req,res,next) {
  if ( !req.headers.host.match(/localhost/)
    && req.headers["x-forwarded-proto"] !== "https" ) {
    res.redirect(301, "https://" + req.headers.host);
  } else { 
    next(); 
  }
});

momentjs.locale("fr");

var dbclient = new Promise(function(resolve, reject) {
  MongoClient.connect(mongoUrl, function(err, client) {
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

var mailchimp = new Mailchimp(mailchimpKey);

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

app.get("/", function(req,res) {
  dbclient.then(function(dbs) {
    
    var eventPromise = new Promise( function(resolve, reject) {
      var collection = dbs.collection("event");
      collection.find({date: {$gte: new Date()} }).sort({date: 1}).limit(4).toArray(function(err, result) {
        var data = result.map(function(event) {
          var moment = momentjs(event.date);
          event.month = momentjs.monthsShort(moment.month());
          event.dateOfMonth = moment.date();
          event.day = momentjs.weekdaysShort(moment.weekday()+1);
          event.time = moment.format("HH:mm");
          event.fromNow = moment.fromNow();
          return event;
        });
        if (err) reject(err);
        resolve(data);
      });
    });
    var annoncePromise = new Promise( function(resolve, reject) {
      var collection = dbs.collection("annonce");
      collection.findOne({current: true}, function(err, result) {
        if (err) reject(err);
        resolve(result);
      });
      
    });

    Promise.all([eventPromise, annoncePromise]).then(function(list) {
      res.render("index", {events: list[0], annonce: list[1]});
    }, function() {
      res.render("index", {error: "error"});
    });

  }).catch(function() {
    res.render("index", {error: "error"});
  });
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
  res.render("newsletter");
});

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

    /*var mailPromise = */new Promise(function (reject, resolve) {
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          reject(error);
          // res.redirect("/error");
        } else {
          console.log("Email sent: " + info.response);
          resolve(info);          
        }
      });
    });

    var chimpPromise = mailchimp.post({
      path : "/lists/9a96b016db", // list newsletter
      body: {
        members: [
          {email_address: newmail, status: "subscribed"}
        ]
      }
    }).then(function (result) {
      console.log(result);
    }).catch(function (err) {
      console.log(err);
      res.redirect("/error");
    });

    /*var dbPromise = */dbclient.then(function(dbs) {
      var collection = dbs.collection("newsletter");
      collection.insertOne({email: newmail}, function(err, data) {
        if(err) throw(err);
        console.log(data);
      });
    });

    chimpPromise.then(function() {
      res.redirect("/newsletterSuccess");
    }).catch(function() {
      res.redirect("/error");
    });

  } else {
    res.redirect("/error");
  }
});

app.get("/events", function (req, res) {
  dbclient.then(function(dbs) {
    var collection = dbs.collection("event");
    collection.find({date: {$gte: new Date()} }).sort({date: 1}).skip(req.query.cur - 0).toArray(function(err, result) {
      var data = result.map(function(event) {
        var moment = momentjs(event.date);
        event.month = momentjs.monthsShort(moment.month());
        event.dateOfMonth = moment.date();
        event.day = momentjs.weekdaysShort(moment.weekday()+1);
        event.time = moment.format("HH:mm");
        event.fromNow = moment.fromNow();
        return event;
      });
      if(err) {
        res.send({error: "error"});
        console.log(err);
      }
      res.render("templates/events", {events: data});
    });
  }).catch(function(err) {
    console.log(err);
    res.send({error: "error"});
  });
});

app.use(function(req, res) {
  res.status(404).render("404");
});



app.listen(port, function() {
  console.log("\x1b[32m", "app listening on port", port, "\x1b[0m");
});







