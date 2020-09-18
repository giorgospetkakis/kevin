const SlackBot = require("slackbots");
const Discord = require("discord.js");
const RiveScript = require("rivescript");
var express = require("express");

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

// Initialize Rivescript
var rive = new RiveScript({ utf8: true });
rive
  .loadFile(["substitutions.rive", "kevin.rive"])
  .then(loading_done)
  .catch(loading_error);

// Rivescript loading done
function loading_done() {
  console.log("Rivescript bot has finished loading!");
  rive.sortReplies();
}

// Rivescript loading failed
function loading_error(error, filename, lineno) {
  console.log("Error when loading files: " + error);
}

// ==== SLACK =====
// Initialize SlackBot
const slack_bot = new SlackBot({
  token: process.env.SLACK_TOKEN,
  name: "Kevin the Office Dog",
});

// Post (Re)start Message
slack_bot.on("start", () => {
  console.log("Slack bot has started.");
});

// Error Handler
slack_bot.on("error", (err) => console.log(err));

// Message Handler
slack_bot.on("message", (data) => {
  if (data.type !== "message") {
    return;
  }

  const user = slack_bot
    .getUsers()
    ._value.members.find((element) => element.id == data.user);

  if (user) {
    handleSlackMessage(data.text, user.name);
  }
});

// Query rive to respond to messages
function handleSlackMessage(message, user) {
  rive.reply(user, message).then(function (reply) {
    replyToSlackUser(user, reply);
  });
}

// Reply to the user
function replyToSlackUser(user, reply) {
  slack_bot.postMessageToUser(user, reply);
}

// ===== DISCORD =====
const discord_bot = new Discord.Client();
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
discord_bot.login(DISCORD_TOKEN);

// Post (re)start message
discord_bot.on("ready", () => {
  console.log("Discord bot has started.");
});

// Error Handler
discord_bot.on("error", (err) => console.log(err));

// Message handler
discord_bot.on("message", (msg) => {
  if (msg.author.id === discord_bot.user.id) {
    return;
  }
  handleDiscordMessage(msg, replyToDiscordUser);
});

// Query rive to respond to messages
function handleDiscordMessage(message, user) {
  rive.reply(user, message.content).then(function (reply) {
    replyToDiscordUser(message, reply);
  });
}

// Reply to the user
function replyToDiscordUser(message, reply) {
  message.channel.send(reply);
}
