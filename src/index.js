//imports
const Discord = require("discord.js");
const {
  getPrefixCommands,
  runPrefixCommand,
  getSlashCommands,
  runSlashCommand,
} = require("./handlers/commandHandler.js");
const { prefix, token } = require("./config/botconfig.json");

const client = new Discord.Client({
  intents: new Discord.Intents(513),
});

//when bot is online
client.on("ready", async () => {
  console.log("ESI bot ready!");
  client.prefixCommands = await getPrefixCommands();
  client.slashCommands = await getSlashCommands();
});

//check if message is not from a bot, and is a possible command, then attempt to run
client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith(prefix)) runPrefixCommand(client, message);
});

//check if interation created is a registered command, then attempt to run
client.on("interactionCreate", (interaction) => {
  if (!interaction.isCommand()) return;
  runSlashCommand(client, interaction);
});

//bot login
client.login(token);
