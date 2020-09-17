const SlackBot = require('slackbots');
const Discord = require('discord.js');
const RiveScript = require('rivescript');

const slack_bot = new SlackBot({
    token: process.env.SLACK_TOKEN,
    name:"Kevin the Office Dog"
});

const discord_bot = new Discord.Client();
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

var rive = new RiveScript({utf8: true});

discord_bot.login(DISCORD_TOKEN);

// Start handler
slack_bot.on('start', () => {
    init();

    slack_bot.postMessageToChannel("general", "I awake! :dog:");
});

// Start handler
discord_bot.on('ready', () => {
    init();
});

discord_bot.on('message', msg => {
    console.log(discord_bot.user);
    if(msg.author.id === discord_bot.user.id){
        return;
    }
    handleDiscordMessage(msg, replyToDiscordUser);
  });

function init()
{
    rive.loadFile([
        "substitutions.rive",
        "kevin.rive"
        
      ]).then(loading_done).catch(loading_error);
}

// Error Handler
slack_bot.on('error', err => console.log(err));

// Message Handler
slack_bot.on('message', data => {
    if (data.type !== 'message') {
      return;
    }

    const user = slack_bot.getUsers()._value.members.find(element => element.id == data.user);

    if(user) {
        handleSlackMessage(data.text, user.name);
    }
    
  });
  
  // Query rive to respond to messages
  function handleSlackMessage(message, user){
    rive.reply(user, message).then(function(reply) {
        replyToSlackUser(user, reply);
    });
  }

    // Query rive to respond to messages
    function handleDiscordMessage(message, user){
        rive.reply(user, message.content).then(function(reply) {
            replyToDiscordUser(message, reply);
        });
      }

  function replyToSlackUser(user, reply)
  {
    slack_bot.postMessageToUser(user, reply);
  }

  function replyToDiscordUser(message, reply)
  {
    message.channel.send(reply);
  }

  function loading_done() {
    console.log("Bot has finished loading!");
    rive.sortReplies();
  }
  
  function loading_error(error, filename, lineno) {
    console.log("Error when loading files: " + error);
  }