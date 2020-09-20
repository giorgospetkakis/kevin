var express = require("express");
var dotenv = require("dotenv");
var discord = require('./src/discord-bot');
var slackbot = require("./src/slack-bot");

// // Keep the app alive
// setInterval(report, 3600 * 5);
// function report() {
//   console.log("report"); //TODO: Make this an actual report for the logs
// }

// Fix the Heroku $PORT error
var app = express();
app.set("port", process.env.PORT || 5000);
app
  .get("/", function (request, response) {
    var result = "App is running";
    response.send(result);
  })
  .listen(app.get("port"), function () {
    console.log(
      "App is running, server is listening on port ",
      app.get("port")
    );
  });