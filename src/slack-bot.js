const SlackBot = require("slackbots");
const rive = require("./rive-backend");

// Initialize SlackBot
const slack_bot = new SlackBot({
    token: "xoxb-1376262550244-1383262827025-g9rnoaeXthi6wvdAqWfCntz1", //process.env.SLACK_TOKEN,
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
    rive.getRiveBackend().reply(user, message).then(function (reply) {
      replyToSlackUser(user, reply);
    });
  }
  
  // Reply to the user
  function replyToSlackUser(user, reply) {
    slack_bot.postMessageToUser(user, reply);
  }