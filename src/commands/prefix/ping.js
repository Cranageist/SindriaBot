const Discord = require("discord.js");

const info = {
  name: "ping",
  description: "Pong!",
  usage: "ping",
  alias: ["p"],
};

function run(client, message, args) {
  message.channel.send(`> Pong`);
}

module.exports = {
  info,
  run,
};
