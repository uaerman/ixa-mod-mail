const mongoose = require("mongoose")
const { Client, Intents, Permissions, MessageEmbed, Collection } = require("discord.js");
const client = new Client({
  intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.GUILD_PRESENCES, 
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.DIRECT_MESSAGES,
      Intents.FLAGS.DIRECT_MESSAGE_TYPING,
      Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
      Intents.FLAGS.DIRECT_MESSAGE_TYPING,     
  ],
  partials: ["CHANNEL"]
})
module.exports = client;

const { settings } = require("./config");
const {log} = require("./Utils/consoleLog")

const chalk = require("chalk")
const moment = require("moment")

client.commands = new Collection();
client.prefix = settings.prefix;
require("./handlers/commandHandler")
require("./handlers/eventHandler")(client)
require("./modMail")(client)

mongoose.connect(settings.mongodb_sv, {
  useNewUrlParser: true, 
  useUnifiedTopology: true,

}).then(()=>{
  log(`${chalk.red("[IXA]")} ${chalk.yellow("Connected to the database!")}`)
}).catch((err) => {
  log(err);
})

client
  .login(settings.token)
  .then(() => log(`${chalk.red("[IXA]")} ${chalk.green("Bot Connected!")}`))
  .catch(() => log(`${chalk.red("[IXA]")} ${chalk.red("Bot can't connected!")}`));

client.on("warn", (info) => log(info));
client.on("error", console.error);
