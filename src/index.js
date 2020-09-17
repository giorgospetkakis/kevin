const SlackBot = require('slackbots');
const axios = require('axios');
const RiveScript = require('rivescript');

const bot = new SlackBot({
    token:"xoxb-1376262550244-1383262827025-g9rnoaeXthi6wvdAqWfCntz1",
    name:"Kevin the Office Dog"
});

var rive = new RiveScript({utf8: true});

// Start handler
bot.on('start', () => {

    rive.loadFile([
        "kevin.rive",
        "substitutions.rive"
      ]).then(loading_done).catch(loading_error);

    bot.postMessageToChannel("kevins-kennel", "I awake! :dog:");
});

// Error Handler
bot.on('error', err => console.log(err));

// Message Handler
bot.on('message', data => {
    if (data.type !== 'message') {
      return;
    }

    const user = bot.getUsers()._value.members.find(element => element.id == data.user);

    if(user) {
        handleMessage(data.text, user.name);
    }
    
  });
  
  // Query rive to respond to messages
  function handleMessage(message, user) {

    rive.reply(user, message).then(function(reply) {
        bot.postMessageToUser(user, reply);
    });
  }

  function loading_done() {
    console.log("Bot has finished loading!");
    rive.sortReplies();
  }
  
  function loading_error(error, filename, lineno) {
    console.log("Error when loading files: " + error);
  }