const mongoose = require("mongoose")
const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences, 
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.DirectMessageReactions,  
  ],
  partials: [Partials.Channel],
})

module.exports = client;

const { settings } = require("./config");
const {log} = require("./Utils/consoleLog")

const chalk = require("chalk")

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
