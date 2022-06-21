const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");

const info = {
  name: "echo",
  description: "Replies with your input!",
};

async function run(client, interaction) {
  let echoText = interaction.options.getString("echotext");
  let times = interaction.options.getInteger("times");

  if (times == 0) {
    await interaction.reply("Nothing to echo");
  } else if (times < 0) {
    await interaction.reply("I can't do that");
  } else if (times > 1) {
    let prop = echoText;

    for (let i = 1; i < times; i++) {
      prop = prop + `\n${echoText}`;
    }

    await interaction.reply(prop);
  } else {
    await interaction.reply(echoText);
  }
}

const data = new SlashCommandBuilder()
  .setName("echo")
  .setDescription("Replies with your input!")
  .addStringOption((option) =>
    option
      .setName("echotext")
      .setDescription("The input to echo back")
      .setRequired(true)
  )
  .addIntegerOption((option) =>
    option
      .setName("times")
      .setDescription("The amount of times to echo back")
      .setRequired(false)
  );

module.exports = {
  info,
  run,
  data,
};
