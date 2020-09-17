const SlackBot = require('slackbots');
const axios = require('axios');

const bot = new SlackBot({
    token:"xoxb-1376262550244-1383262827025-g9rnoaeXthi6wvdAqWfCntz1",
    name:"Kevin the Office Dog"
});

// Start handler
bot.on('start', () => {
    const params = {
        icon_emoji: ":dog:"
    };

    bot.postMessageToChannel("kevins-kennel", "Woof!", params);
});

// Error Handler
bot.on('error', err => console.log(err));

// Message Handler
bot.on('message', data => {
    if (data.type !== 'message') {
      return;
    }

    const user = bot.getUsers()._value.members.find(element => element.id == data.user);

    if(user)
    {
        handleMessage(data.text, user.name);
    }
    
  });
  
  // Respond to Data
  function handleMessage(message, user) {
    if (message.includes("good boy"))
    {
        boy(user);

    } else {
        woof(user);
    }
    
  }
  
  // I know the answer to this one!!!!
  function boy(user) {

    bot.postMessageToUser(user, "I am a good boy!!!!!!!!!!!"); 
  
  }

    // Woof at user!!!!
  function woof(user) {

    bot.postMessageToUser(user, "Woof!"); 
  
  }