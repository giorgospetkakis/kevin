const Discord = require("discord.js");
const rive = require("./rive-backend");

// ===== DISCORD =====
const discord_bot = new Discord.Client();
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
discord_bot.login(
  "NzU2MjM5MjYwMTAwNzIyNzc5.X2O8sQ.wXRcHoxkd_J-0K1NkVYmWAmVBCA"
); //(DISCORD_TOKEN);

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

  if (msg.channel.name !== "kevin-dev-channel") {
    return;
  }

  handleDiscordMessage(msg, replyToDiscordUser);
});

// Query rive to respond to messages
function handleDiscordMessage(message, user) {
  rive
    .getRiveBackend()
    .reply(user, message.content)
    .then(function (reply) {
      replyToDiscordUser(message, reply);
    });
}

// Reply to the user
function replyToDiscordUser(message, reply) {
  if (reply === "Reply not matched." || reply === "ERR: No Reply Matched") return;
  else message.channel.send(reply);
}
