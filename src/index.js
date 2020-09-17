const SlackBot = require('slackbots');
const axios = require('axios');

const bot = new SlackBot({
    token:"xoxb-1376262550244-1367010574181-8lufkOlQX3xxnzVrQp2L3cBS",
    name:"kevin_the_office_dog"
});

// Start handler
bot.on('start', () => {
    const params = {
        icon_emoji: ":dog:"
    };

    bot.postMessageToChannel("general", "Woof!", params);
});