const { glob } = require("glob");
const { prefix, token } = require("./../config/botconfig.json");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const clientID = "863668047239446538";
const guildID = "793335468087312424";

const rest = new REST({ version: "9" }).setToken(token);

async function getPrefixCommands() {
  let aliasCounter = 0;
  let prefixCommandMap = new Map();

  //get all jsfiles in commands/prefix and all its subfolders
  await new Promise((resolve, reject) => {
    glob("commands/prefix/**/*.js", (err, dirs) => {
      //return if error
      if (err) reject(err);

      //map commandname/dir pair into prefixCommandMap
      for (const dir of dirs) {
        let prop = require(`./../${dir}`);
        prefixCommandMap.set(prop.info.name, `./../${dir}`);

        //skip if no aliases found
        if (!prop.info.alias) continue;

        //map all alias/dir pairs into prefixCommandMap
        for (const alias of prop.info.alias) {
          prefixCommandMap.set(alias, `./../${dir}`);
          aliasCounter++;
        }
      }

      resolve("Got all prefix commands.");
    });
  }).catch((err) => console.log(err));

  console.log(
    `Loaded ${
      prefixCommandMap.size - aliasCounter
    } prefix commands w/ ${aliasCounter} alias(es)`
  );
  console.log(prefixCommandMap);

  return prefixCommandMap;
}

function runPrefixCommand(
  client,
  message /* message must start with prefix */
) {
  //parse message
  let content = message.content;
  content = content.replace(/  +/g, " ").split(" ");
  let command = content.shift().substring(prefix.length);
  let args = content;

  //only run if command exists
  if (!client.prefixCommands.get(command)) return;
  commandFile = require(client.prefixCommands.get(command));
  commandFile.run(client, message, args);
}

async function getSlashCommands() {
  let slashCommandMap = new Map();
  let slashCommandArray = [];

  //get all jsfiles in commands/prefix and all its subfolders
  await new Promise((resolve, reject) => {
    glob("commands/slash/**/*.js", (err, dirs) => {
      //return if error
      if (err) reject(err);

      //map commandname/dir pair into slashCommandMap
      //push command json data into slashCommandArray
      for (const dir of dirs) {
        let prop = require(`./../${dir}`);
        slashCommandMap.set(prop.info.name, `./../${dir}`);
        slashCommandArray.push(prop.data);
      }

      resolve("Got all slash commands.");
    });
  }).catch((err) => console.log(err));

  console.log("Started refreshing slash commands.");

  await rest.put(Routes.applicationGuildCommands(clientID, guildID), {
    body: slashCommandArray,
  });

  console.log("Successfully reloaded slash commands.");

  console.log(`Loaded ${slashCommandMap.size} slash command(s)`);
  console.log(slashCommandMap);

  return slashCommandMap;
}

function runSlashCommand(client, interaction) {
  //only run if slash command exists
  if (!client.slashCommands.get(interaction.commandName)) return;
  let commandFile = require(client.slashCommands.get(interaction.commandName));
  commandFile.run(client, interaction);
}

module.exports = {
  getPrefixCommands,
  runPrefixCommand,
  getSlashCommands,
  runSlashCommand,
};
